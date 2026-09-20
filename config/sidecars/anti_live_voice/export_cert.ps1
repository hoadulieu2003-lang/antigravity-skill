$cert = Get-ChildItem Cert:\CurrentUser\My | Where-Object { $_.Subject -like "*192.168.1.13*" } | Select-Object -First 1
if ($cert) {
    $pwd = ConvertTo-SecureString -String "anti123" -Force -AsPlainText
    Export-PfxCertificate -Cert $cert -FilePath "$PSScriptRoot\cert.pfx" -Password $pwd
    Write-Host "CERT_EXPORTED_OK"
} else {
    Write-Host "CERT_NOT_FOUND"
}
