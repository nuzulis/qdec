<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
?>
<?php
if (!isset($_GET['id']) || empty($_GET['id'])) {
    die("ID tidak ditemukan.");
}
$id = base64_decode($_GET['id']);

$api_url = "https://api3.karantinaindonesia.go.id/qdec/findQDec?id=" . urlencode($id);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $api_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Basic bXJpZHdhbjpaPnV5JCx+NjR7KF42WDQm",
    "Content-Type: application/json",
]);
$response = curl_exec($ch);
curl_close($ch);

$result = json_decode($response, true);

$id_permohonan   = '-';
$no_paspor       = '-';
$respon_text     = '-';
$rekom_petugas_text  = '-';

if ($result && isset($result['data'])) {
    $data = $result['data'];
    if (!empty($data['payload'])) {
        $payload = json_decode($data['payload'], true);
        $id_permohonan = $payload['id_permohonan'] ?? '-';
        $no_paspor     = $payload['tdHeader']['paspor'] ?? '-';
    }

    $respon_text    = $data['respon_text'] ?? '-';
    $respon_petugas_text = $data['rekom_petugas_text'] ?? '-'; 
}

?>
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Detail Deklarasi</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen flex items-start justify-center p-4">
  <div class="w-full max-w-full sm:max-w-xl md:max-w-3xl space-y-6">
    <div class="bg-white shadow-2xl rounded-3xl p-8 sm:p-10">
      <h1 class="text-5xl font-extrabold text-gray-800 mb-10 border-b pb-5 text-center sm:text-left">
        Detail Deklarasi
      </h1>

      <dl class="space-y-8">
        <div class="flex flex-col">
          <dt class="text-3xl font-semibold text-gray-600">ID Permohonan</dt>
          <dd class="mt-3 text-3xl font-bold text-gray-900 break-words">
            <?= htmlspecialchars($id_permohonan) ?>
          </dd>
        </div>
        <di class="flex flex-col">
          <dt class="text-3xl font-semibold text-gray-600">Nomor Paspor</dt>
          <dd class="mt-3 text-3xl font-bold text-gray-900 break-words">
            <?= htmlspecialchars($no_paspor ?? '-') ?>
          </dd>
          </di>
        <div class="flex flex-col">
          <dt class="text-3xl font-semibold text-gray-600 mb-3">Respon</dt>
          <dd>
            <?php
              $responColor = match(strtoupper($respon_text ?? '')) {
                'PERIKSA' => 'bg-yellow-400 text-yellow-900',
                'RILIS' => 'bg-green-400 text-green-900',
                'TOLAK/Q-BIN' => 'bg-red-400 text-red-900',
                default => 'bg-gray-300 text-gray-900'
              };
            ?>
            <span class="inline-block px-8 py-4 text-2xl sm:text-3xl font-bold rounded-full <?= $responColor ?>">
              <?= $respon_text ?? '-' ?>
            </span>
          </dd>
        </div>
        <div class="flex flex-col">
          <dt class="text-3xl font-semibold text-gray-600 mb-3">Rekomendasi Petugas</dt>
          <dd>
            <?php
              $petugasColor = match(strtoupper($respon_petugas_text ?? '')) {
                'PERIKSA' => 'bg-yellow-400 text-yellow-900',
                'RILIS' => 'bg-green-400 text-green-900',
                'TOLAK/Q-BIN' => 'bg-red-400 text-red-900',
                default => 'bg-gray-300 text-gray-900'
              };
            ?>
            <span class="inline-block px-8 py-4 text-2xl sm:text-3xl font-bold rounded-full <?= $petugasColor ?>">
              <?= $respon_petugas_text ?? '-' ?>
            </span>
          </dd>
        </div>

      </dl>
    </div>

  </div>
</body>
</html>
