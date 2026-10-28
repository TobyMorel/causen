"""Genera capturas reales de los cinco sitios públicos usando un navegador local con Internet.

Requiere: pip install playwright && python -m playwright install chromium
Uso: python tools/capturar-juegos.py
"""
from pathlib import Path
import asyncio
from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parents[1]
CAPTURAS = ROOT / "assets" / "capturas"
GAMES = {
    "republica": "https://republica-mundial.vercel.app/",
    "nexo": "https://nexo-xi-eight.vercel.app/",
    "expediente": "https://expendiente.vercel.app/",
    "barro": "https://desde-el-barro.vercel.app/",
    "logisys": "https://logysys.vercel.app/",
}

async def main():
    CAPTURAS.mkdir(exist_ok=True, parents=True)
    captured = []
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(headless=True)
        for name, url in GAMES.items():
            page = await browser.new_page(viewport={"width": 1440, "height": 900}, device_scale_factor=1)
            try:
                print(f"Abriendo {url}")
                response = await page.goto(url, wait_until="domcontentloaded", timeout=35000)
                if not response or response.status >= 400:
                    raise RuntimeError(f"Respuesta HTTP no válida: {response.status if response else 'sin respuesta'}")
                try:
                    await page.wait_for_load_state("networkidle", timeout=8000)
                except Exception:
                    pass
                await page.wait_for_timeout(2000)
                await page.screenshot(path=CAPTURAS / f"{name}.png", full_page=False, animations="disabled")
                captured.append(name)
                print(f"  ✓ {name}.png")
            except Exception as exc:
                print(f"  ✗ No se pudo capturar {name}: {exc}")
            finally:
                await page.close()
        await browser.close()
    # Script opcional: el archivo se carga en index.html ANTES que app.js.
    # Pulso Estelar tiene una captura autenticada guardada en el repositorio.
    # No reemplazarla con la pantalla de login del despliegue de rama.
    captured_mapping = {'pulso': 'assets/pulso-real.avif'}
    captured_mapping.update({name: f'assets/capturas/{name}.png' for name in captured})
    mapping = ",\n".join(f'  "{name}": "{path}"' for name, path in captured_mapping.items())
    (ROOT / "js" / "capturas-locales.js").write_text(
        f"// Generado automáticamente por tools/capturar-juegos.py\nwindow.LOCAL_CAPTURE_URLS = {{\n{mapping}\n}};\n",
        encoding="utf-8",
    )
    print(f"Capturas guardadas: {len(captured)}/{len(GAMES)}")

if __name__ == "__main__":
    asyncio.run(main())
