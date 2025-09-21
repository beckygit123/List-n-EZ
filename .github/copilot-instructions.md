# Copilot Instructions for eCommerce Autolister

## Project Overview
This repository automates product listing for Facebook Marketplace (FBMP), Etsy, and (in progress) eBay. It uses Python scripts and web scraping to interact with marketplaces, leveraging credentials and spreadsheet data for item management.

## Key Components
- **Listing Scripts**: `fbmp_desktop_sel_list.py`, `fbmp_mobile_sel_list.py`, `etsy_desktop_sel_list.py`, `ebay_desktop_sel_list.py` — Automate listings for each marketplace.
- **Webscrapers**: `webscraperali.py`, `webscraperchewy.py`, `webscraperebay.py`, `webscraperetsy.py`, `webscraperwayfair.py`, `webscraperwmt.py` — Scrape product data from various sources.
- **Credential Management**: `set_creds.py` — Required for authentication; must be run before listing or scraping.
- **Data Source**: `Dropshipping Items/DROPSHIPPING_SPREADSHEET.xlsx` — Central spreadsheet for product information.
- **Config Files**: `xpath_params.yaml` (scraper parameters), `log_config.yaml` (logging setup).

## Developer Workflows
- **Environment Setup**:
  - Use Python 3.8.8 and pipenv.
  - Install dependencies: `pipenv install`
  - Ensure `chromedriver.exe` matches your Chrome version.
- **Authentication**:
  - Run `set_creds.py` to set up credentials before any listing or scraping.
- **Running Scripts**:
  - Example: `pipenv run python fbmp_desktop_sel_list.py`
  - Listing scripts require valid credentials and access to the spreadsheet.
- **Logging**:
  - Logs are configured via `log_config.yaml` and output to the `log/` directory.
- **Documentation**:
  - See [project docs](https://ehgp.github.io/ecommerce_autolister) and `docs/source/` for usage and guides.

## Patterns & Conventions
- **Marketplace-specific scripts**: Each marketplace has a dedicated script for desktop/mobile automation.
- **Webscraper modules**: Each source (AliExpress, Chewy, etc.) has a separate scraper module.
- **Centralized data**: All product and link data is managed via the spreadsheet and CSVs in `Dropshipping Items/`.
- **Configurable XPaths**: Scraper selectors are managed in `xpath_params.yaml` for easy updates.
- **Credentials**: Never hardcode credentials; always use `set_creds.py`.

## Integration Points
- **External dependencies**: Selenium (via chromedriver), pipenv, Python 3.8.8.
- **Spreadsheet and CSVs**: Scripts read/write to `Dropshipping Items/` for product and link management.
- **Marketplace APIs**: Authentication and listing are performed via browser automation, not direct API calls.

## Example Workflow
1. Run `set_creds.py` to set credentials.
2. Update product info in `Dropshipping Items/DROPSHIPPING_SPREADSHEET.xlsx`.
3. Run the desired listing script (e.g., `pipenv run python fbmp_desktop_sel_list.py`).
4. Check logs in `log/` for errors or status.

## References
- Key scripts: `fbmp_desktop_sel_list.py`, `etsy_desktop_sel_list.py`, `set_creds.py`, `webscraperali.py`
- Data/config: `Dropshipping Items/`, `xpath_params.yaml`, `log_config.yaml`
- Docs: `docs/source/`, [online documentation](https://ehgp.github.io/ecommerce_autolister)

---
_If any section is unclear or missing, please provide feedback to improve these instructions._
