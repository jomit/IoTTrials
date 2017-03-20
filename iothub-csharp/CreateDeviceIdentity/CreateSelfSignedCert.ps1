$Password = "pass@word1"
$SecurePassword = ConvertTo-SecureString -String $Password -AsPlainText -Force

$CertDNSName = "boeing.iothub.test"
$CertFileFullPath = $pwd.Path + '\' + $CertDNSName + '.pfx'

$NewCert = New-SelfSignedCertificate -CertStoreLocation Cert:\LocalMachine\My -DnsName $CertDNSName
Export-PfxCertificate -FilePath $CertFileFullPath -Password $SecurePassword -Cert $NewCert