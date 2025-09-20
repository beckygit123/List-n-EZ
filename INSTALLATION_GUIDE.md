# 🔥 COMPLETE INSTALLATION GUIDE FOR LISTYNZ-AGENT

## 📋 PREREQUISITES (Install these first!)

### 1. Install Python 3.11+
- Download from: https://www.python.org/downloads/
- ✅ IMPORTANT: Check "Add Python to PATH" during installation
- Verify: Open PowerShell and type `python --version`

### 2. Install Git
- Download from: https://git-scm.com/download/win
- Use default settings during installation
- Verify: Open PowerShell and type `git --version`

### 3. Install Node.js (for the web app)
- Download from: https://nodejs.org/
- Choose LTS version
- Verify: `node --version` and `npm --version`

### 4. Install Ollama (for AI)
- Download from: https://ollama.ai/download
- Follow installation instructions

## 🤖 AI TOOLS INSTALLATION

```powershell
# Navigate to your project
cd "C:\Users\solar\Desktop\AI-Listynz'EZ\ai-tools"

# Install essential Python packages
pip install rembg realesrgan pytesseract opencv-python
pip install scrapy selenium ebaysdk fastapi uvicorn
pip install clip-by-openai salesforce-blip gfpgan

# Clone important repositories
git clone https://github.com/danielgatis/rembg.git
git clone https://github.com/xinntao/Real-ESRGAN.git
git clone https://github.com/xuebinqin/U-2-Net.git
git clone https://github.com/TencentARC/GFPGAN.git
```

## 📄 BUSINESS TOOLS INSTALLATION

```powershell
# Create business tools directory
mkdir business-tools
cd business-tools

# Resume & CV Tools
git clone https://github.com/jsonresume/resume-cli.git
git clone https://github.com/rbardini/resumed.git
git clone https://github.com/jankapunkt/latexcv.git

# Business Cards
git clone https://github.com/vishnuraghavb/EnBizCard.git
git clone https://github.com/rclement/business-card-generator.git
git clone https://github.com/kaydo1506/Business-Card-Creator.git

# Invoice Generators
git clone https://github.com/Invoice-Generator/invoice-generator-api.git
git clone https://github.com/johnuberbacher/invoice-generator.git

# PDF Builders
git clone https://github.com/Kozea/WeasyPrint.git

# Coloring Books & Art Tools
git clone https://github.com/codebyahmed/coloring-book-creator.git
git clone https://github.com/Priyanshu7129/image-to-pencil-sketch-with-python.git

# Stickers & Labels
git clone https://github.com/ducky64/labelmaker.git
git clone https://github.com/Edinburgh-Genome-Foundry/blabel.git
git clone https://github.com/flesch/svg-label-maker.git
```

## 🎨 SPECIALIZED DIGITAL PRODUCTS & INSERTS

```powershell
# Create specialized tools directory
mkdir specialized-tools
cd specialized-tools

# Print-on-Demand & Mockup Tools
git clone https://github.com/mockup-generator/mockup-generator.git
git clone https://github.com/farhan-shaikh/react-tshirt-design.git
git clone https://github.com/tsaylor/tshirt-creator.git

# Advanced Label & Sticker Tools
git clone https://github.com/ducky64/labelmaker.git
git clone https://github.com/Edinburgh-Genome-Foundry/blabel.git
git clone https://github.com/flesch/svg-label-maker.git
git clone https://github.com/bhousel/svg-labels.git

# Document & Insert Generators
git clone https://github.com/Kozea/WeasyPrint.git
git clone https://github.com/CourtBouillon/weasyprint-samples.git
git clone https://github.com/wkhtmltopdf/wkhtmltopdf.git

# Outline & Stencil Creators
git clone https://github.com/gsethi2409/GsColorbook.git
git clone https://github.com/codebyahmed/coloring-book-creator.git

# Full E-commerce Platforms (Advanced)
git clone https://github.com/saleor/saleor.git
git clone https://github.com/bagisto/bagisto.git
git clone https://github.com/opencart/opencart.git
```

## 🛠️ PYTHON PACKAGES FOR BUSINESS TOOLS

```powershell
# Install packages for document generation
pip install weasyprint reportlab fpdf2
pip install pillow qrcode vobject
pip install jinja2 markdown beautifulsoup4

# Install packages for image processing
pip install opencv-python scikit-image
pip install matplotlib seaborn
pip install svglib cairosvg

# Install packages for specialized tools
pip install flask django fastapi
pip install requests beautifulsoup4 lxml
pip install pandas numpy openpyxl
pip install barcode python-qrcode[pil]
pip install wand imageio-ffmpeg

# Install packages for e-commerce platforms
pip install stripe paypal-rest-sdk
pip install sendgrid mailgun-python
pip install redis celery
```

## 🚀 SETUP YOUR LISTYNZ-AGENT

```powershell
# Go back to main project
cd "C:\Users\solar\Desktop\AI-Listynz'EZ"

# Create the AI agent
cd agent
ollama create lystynz-agent -f Modelfile

# Install server dependencies
cd ../server
npm install

# Install app dependencies (includes new UI components)
cd ../app
npm install

# Start everything (in separate terminals)
# Terminal 1: Start Ollama
ollama serve

# Terminal 2: Start backend
cd server
npm start

# Terminal 3: Start frontend
cd app
npm run dev
```

## 🎨 NEW FEATURES ADDED

### 🤖 **AI Chat Assistant**
- Interactive chat with your LystynZ-Agent
- Get help with product descriptions, pricing, customer service
- Real-time responses powered by LLaMA 3.2

### 🛠️ **Tools Workspace**
- Browse categorized GitHub repositories
- Search functionality within each category
- Direct links to all tools and resources
- Beautiful, responsive interface

### 📚 **Categories Available:**
- 🖥 Digital Add-Ons (mockups, t-shirt designers, labels)
- 👗 Clothing & Apparel Inserts (care cards, thank you notes)
- 🔌 Tech & Electronics Inserts (quick start guides, warranties)
- 🔧 Tools & DIY Inserts (safety instructions, assembly guides)
- 🛍 Universal 'Last Touch' Products (resumes, gift cards)
- 🛒 E-commerce Platforms (full store solutions)
- 📦 Reseller Tools (automation, import/export tools)

## ✅ VERIFICATION CHECKLIST

- [ ] Python installed: `python --version`
- [ ] Git installed: `git --version`
- [ ] Node.js installed: `node --version`
- [ ] Ollama installed: `ollama --version`
- [ ] AI agent created: `ollama list` (should show lystynz-agent)
- [ ] Backend running: http://localhost:3000
- [ ] Frontend running: http://localhost:5173

## 🎯 WHAT YOU CAN DO NOW

### AI-Powered Reselling:
- Remove backgrounds from product photos
- Generate product descriptions
- Price research and optimization
- Customer service responses

### Digital Product Creation:
- Generate professional resumes/CVs
- Create digital business cards
- Build invoice templates
- Make coloring books
- Design stickers and labels
- Create printable planners

## 🆘 TROUBLESHOOTING

**Python not found?**
- Reinstall Python with "Add to PATH" checked
- Restart PowerShell after installation

**Git not found?**
- Restart PowerShell after Git installation
- Try `git.exe --version` instead

**Ollama issues?**
- Make sure Ollama service is running
- Try `ollama serve` in a separate terminal

**Package installation fails?**
- Try `pip install --upgrade pip` first
- Use `pip install --user <package>` if permission issues