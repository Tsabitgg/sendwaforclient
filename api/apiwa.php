<?php
session_start();
header("Content-Type: application/json");

function sendWhatsAppMessage($phone_no, $message, $project_name)
{
    $mainConn = new mysqli('localhost', 'root', 'Smartpay1ct', 'sendwa');
    // $mainConn = new mysqli('localhost', 'root', '', 'apiwa');
    $stmt = $mainConn->prepare("SELECT wa_apikey, wa_numberkey FROM master_setting WHERE project_name = ?");
    $stmt->bind_param("s", $project_name);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result && $result->num_rows > 0) {
        $credentials = $result->fetch_assoc();
        $stmt->close();

        $api_url = 'https://api.watzap.id/v1/send_message';
        $data = [
            "api_key" => $credentials['wa_apikey'],
            "number_key" => $credentials['wa_numberkey'],
            "phone_no" => $phone_no,
            "message" => $message
        ];

        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_URL => $api_url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 20,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_POSTFIELDS => json_encode($data),
            CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        ]);

        $response = curl_exec($curl);
        $error = curl_error($curl);
        curl_close($curl);

        if ($error) {
            return false;
        }

        return $response !== false;
    } else {

        return false;
    }
}

function getPhoneNumbers($method, $target, $dbConnection, $config)
{
    $phoneNumbers = [];
    $studentsTable = $config['siswa'];
    $phoneNumberColumn = $config['phone_column'];
    $classColumn = $config['kelas'];
    $batchColumn = $config['angkatan'];
    $idStudentsColumn = $config['id_siswa'];
    $nameStudentsColumn = $config['nama_siswa_column'];

    switch ($method) {
        case 'SEND_SISWA':
            $stmt = $dbConnection->prepare("SELECT $nameStudentsColumn, $phoneNumberColumn FROM $studentsTable WHERE $idStudentsColumn = ?");
            $stmt->bind_param("s", $target);
            $stmt->execute();
            $result = $stmt->get_result();
            while ($row = $result->fetch_assoc()) {
                $phoneNumbers[] = ['phone' => $row[$phoneNumberColumn], 'nama' => $row[$nameStudentsColumn]];
            }
            break;
        case 'SEND_KELAS':
            $stmt = $dbConnection->prepare("SELECT $nameStudentsColumn, $phoneNumberColumn FROM $studentsTable WHERE $classColumn = ?");
            $stmt->bind_param("s", $target);
            $stmt->execute();
            $result = $stmt->get_result();
            while ($row = $result->fetch_assoc()) {
                $phoneNumbers[] = ['phone' => $row[$phoneNumberColumn], 'nama' => $row[$nameStudentsColumn]];
            }
            break;
        case 'SEND_ANGKATAN':
            $stmt = $dbConnection->prepare("SELECT $nameStudentsColumn, $phoneNumberColumn FROM $studentsTable WHERE $batchColumn = ?");
            $stmt->bind_param("s", $target);
            $stmt->execute();
            $result = $stmt->get_result();
            while ($row = $result->fetch_assoc()) {
                $phoneNumbers[] = ['phone' => $row[$phoneNumberColumn], 'nama' => $row[$nameStudentsColumn]];
            }
            break;
        case 'SEND_ALL':
            $result = $dbConnection->query("SELECT $nameStudentsColumn, $phoneNumberColumn FROM $studentsTable");
            while ($row = $result->fetch_assoc()) {
                $phoneNumbers[] = ['phone' => $row[$phoneNumberColumn], 'nama' => $row[$nameStudentsColumn]];
            }
            break;
    }

    return $phoneNumbers;
}


date_default_timezone_set('Asia/Jakarta');
function logMessage($conn, $nama_pengirim, $message, $nama_penerima, $status, $method, $project_name)
{
    $waktu = date('Y-m-d H:i:s');
    $stmtLog = $conn->prepare("INSERT INTO log_pesan (nama_pengirim, pesan, nama_penerima, status, sent_at, method, project_name) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmtLog->bind_param("sssssss", $nama_pengirim, $message, $nama_penerima, $status, $waktu, $method, $project_name);
    $stmtLog->execute();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    $project_name = $input['project_name'] ?? '';
    $method = $input['method'] ?? '';
    $target = $input['target'] ?? '';
    $description = $input['description'] ?? '';

    if (!in_array($method, ['SEND_SISWA', 'SEND_KELAS', 'SEND_ANGKATAN', 'SEND_ALL'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid method']);
        exit;
    }

    $mainDbConnection = new mysqli('localhost', 'root', 'Smartpay1ct', 'sendwa');
    // $mainDbConnection = new mysqli('localhost', 'root', '', 'apiwa');
    if ($mainDbConnection->connect_error) {
        http_response_code(500);
        echo json_encode(['error' => 'Database connection failed']);
        exit;
    }

    $stmt = $mainDbConnection->prepare("SELECT * FROM master_setting WHERE project_name = ?");
    $stmt->bind_param("s", $project_name);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        http_response_code(404);
        echo json_encode(['error' => 'Project configuration not found']);
        exit;
    }

    $config = $result->fetch_assoc();
    $dbConnection = new mysqli($config['host'], $config['userdb'], $config['passdb'], $config['dbname']);

    if ($dbConnection->connect_error) {
        http_response_code(500);
        echo json_encode(['error' => 'Database connection failed']);
        exit;
    }

    $phoneNumbers = getPhoneNumbers($method, $target, $dbConnection, $config);

    if (empty($phoneNumbers)) {
        http_response_code(404);
        echo json_encode(['error' => 'No phone numbers found']);
        exit;
    }

    $stmtPengirim = $mainDbConnection->prepare("SELECT username FROM master_setting WHERE project_name = ?");
    $stmtPengirim->bind_param("s", $project_name);
    $stmtPengirim->execute();
    $resultPengirim = $stmtPengirim->get_result();
    $nama_pengirim = $resultPengirim->fetch_assoc()['username'];

    $responses = [];
    foreach ($phoneNumbers as $entry) {
        $phoneNo = $entry['phone'];
        $nama_penerima = $entry['nama'];
        $success = sendWhatsAppMessage($phoneNo, $description, $project_name);
        $status = $success ? 'berhasil' : 'gagal';

        logMessage($mainDbConnection, $nama_pengirim, $description, $nama_penerima, $status, $method, $project_name);

        $responses[] = [
            'target' => $phoneNo,
            'message' => $description,
            'status' => $status
        ];
    }

    echo json_encode([
        'status' => 'success',
        'message' => 'Messages processed',
        'data' => $responses
    ]);

    $dbConnection->close();
    $mainDbConnection->close();
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
}
