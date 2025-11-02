Add-Type -AssemblyName System.Drawing

# Crear directorio assets si no existe
$assetsDir = ".\assets"
if (!(Test-Path $assetsDir)) {
    New-Item -ItemType Directory -Path $assetsDir
}

# Crear imagen 1024x1024
$bmp = New-Object System.Drawing.Bitmap(1024, 1024)
$graphics = [System.Drawing.Graphics]::FromImage($bmp)

# Fondo verde
$brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(76, 175, 80))
$graphics.FillRectangle($brush, 0, 0, 1024, 1024)

# Letra C blanca
$font = New-Object System.Drawing.Font("Arial", 400, [System.Drawing.FontStyle]::Bold)
$stringFormat = New-Object System.Drawing.StringFormat
$stringFormat.Alignment = [System.Drawing.StringAlignment]::Center
$stringFormat.LineAlignment = [System.Drawing.StringAlignment]::Center
$graphics.DrawString("C", $font, [System.Drawing.Brushes]::White, 512, 512, $stringFormat)

# Guardar archivos
$bmp.Save("$assetsDir\icon.png")
$bmp.Save("$assetsDir\adaptive-icon.png")
$bmp.Save("$assetsDir\splash.png")
$bmp.Save("$assetsDir\favicon.png")

Write-Host "✅ Assets creados exitosamente en $assetsDir" -ForegroundColor Green
Write-Host "   - icon.png" -ForegroundColor Green
Write-Host "   - adaptive-icon.png" -ForegroundColor Green
Write-Host "   - splash.png" -ForegroundColor Green
Write-Host "   - favicon.png" -ForegroundColor Green

$graphics.Dispose()
$bmp.Dispose()
