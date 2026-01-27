---
title: Kash Critics - Kashmiri Diacritics Converter
emoji: 📝
colorFrom: indigo
colorTo: purple
sdk: docker
app_file: Dockerfile
app_port: 7860
pinned: false
license: mit
---

# کٲشِر Critics - Kashmiri Diacritics Converter

A web-based tool to convert Kashmiri text with diacritical marks (اعراب) to text without diacritics (بے اعراب). Creates parallel datasets for training ML models.

![Kashmiri NLP](https://img.shields.io/badge/Kashmiri-NLP-indigo?style=for-the-badge)
![Docker](https://img.shields.io/badge/Docker-Ready-blue?style=for-the-badge&logo=docker)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)

---

## 🚀 Quick Start

### Option 1: Use Online (Hugging Face Spaces)

**Live Demo:** [https://huggingface.co/spaces/Omarrran/Kashmiri_Diacritical_text_to_non_diacritical_text](https://huggingface.co/spaces/Omarrran/Kashmiri_Diacritical_text_to_non_diacritical_text)

No installation required - just open and use!

---

### Option 2: Run Locally with Docker

```bash
# Clone the repository
git clone https://huggingface.co/spaces/Omarrran/Kashmiri_Diacritical_text_to_non_diacritical_text
cd Kashmiri_Diacritical_text_to_non_diacritical_text

# Build and run with Docker Compose
docker compose up --build

# Access at http://localhost:7860
```

---

### Option 3: Run Locally with Node.js

**Requirements:** Node.js 18+ and npm

```bash
# Clone the repository
git clone https://huggingface.co/spaces/Omarrran/Kashmiri_Diacritical_text_to_non_diacritical_text
cd Kashmiri_Diacritical_text_to_non_diacritical_text

# Install dependencies
npm install

# Start development server
npm run dev

# Access at http://localhost:5173
```

**Build for production:**
```bash
npm run build
npm run preview
```

---

## 🤗 Deploy Your Own Copy to Hugging Face Spaces

### Step 1: Create a New Space

1. Go to [huggingface.co/new-space](https://huggingface.co/new-space)
2. Enter a Space name (e.g., `my-kashmiri-converter`)
3. Select **Docker** as the SDK
4. Choose **Public** or **Private**
5. Click **Create Space**

### Step 2: Clone and Push

```bash
# Clone this repository
git clone https://huggingface.co/spaces/Omarrran/Kashmiri_Diacritical_text_to_non_diacritical_text
cd Kashmiri_Diacritical_text_to_non_diacritical_text

# Remove original remote
rm -rf .git
git init

# Add your Space as remote (replace with your details)
git remote add origin https://YOUR_USERNAME:YOUR_HF_TOKEN@huggingface.co/spaces/YOUR_USERNAME/YOUR_SPACE_NAME

# Push to your Space
git add .
git commit -m "Initial commit"
git push --force origin master:main
```

### Step 3: Get Your HF Token

1. Go to [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
2. Click **New token**
3. Give it a name and select **Write** permission
4. Copy the token and use it in the git URL above

### Step 4: Wait for Build

- The Space will automatically build (2-5 minutes)
- Check the **Logs** tab for build progress
- Once built, your app is live!

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔄 **Diacritics Removal** | Removes all Kashmiri/Arabic diacritical marks |
| 📊 **Multiple Exports** | XLSX, TSV, JSONL formats |
| ⚡ **Large File Support** | Up to 10MB with progress tracking |
| 🔍 **Virtualized Table** | Handles 100K+ rows smoothly |
| 🎨 **Modern UI** | Dark/Light theme with Nastaliq font |
| 📱 **Responsive** | Works on desktop and mobile |

---

## 📊 Output Dataset Use Cases

The parallel dataset (diacritical ↔ non-diacritical) is valuable for:

### 1. 🎯 Diacritics Restoration Models
Train seq2seq models to add diacritics to plain Kashmiri text:
- Transformer models (BERT, T5, mT5)
- LSTM/GRU sequence-to-sequence
- Character-level neural networks

### 2. 🗣️ Text-to-Speech (TTS)
Diacritics enable correct pronunciation for Kashmiri TTS systems.

### 3. 📚 Language Learning
Create pronunciation guides, flashcards, and reading assistants.

### 4. 🔍 Search Normalization
Improve search recall by matching text with/without diacritics.

### 5. 📖 Digital Preservation
Preserve Kashmiri literature in multiple formats.

---

## 🔤 Supported Diacritics

### Marks Removed

| Mark | Name | Example |
|:----:|------|---------|
| َ | Fatha (زَبَر) | اَ |
| ُ | Damma (پیش) | اُ |
| ِ | Kasra (زیر) | اِ |
| ٖ | Subscript Alef | یٖ |
| ٗ | Inverted Damma | وٗ |
| ٚ | Small V Above | وٚ |
| ۪ | Empty Centre Low Stop | دٮ۪د |
| ۭ | Small High Seen | سۭتۍ |
| ّ | Shadda | پَتّھر |
| ٰ | Superscript Alef | رحمٰن |

### Character Normalizations

| Original | Replaced With |
|:--------:|:-------------:|
| ٲ | ا (Alef) |
| أ | ا (Alef) |
| آ | ا (Alef) |
| ؤ | و (Waw) |
| ئ | ی (Yeh) |

---

## 📁 Project Structure

```
├── Dockerfile              # Docker build for HF Spaces
├── nginx.conf              # Nginx configuration
├── docker-compose.yml      # Local Docker development
├── package.json            # Node.js dependencies
├── src/
│   ├── components/         # React UI components
│   │   ├── Header.tsx
│   │   ├── TextConverter.tsx
│   │   ├── ResultsTable.tsx
│   │   ├── ExportPanel.tsx
│   │   └── HelpSection.tsx
│   ├── utils/
│   │   ├── kashmiriDiacritics.ts  # Core diacritics logic
│   │   └── xlsxExporter.ts        # Export functions
│   ├── App.tsx
│   ├── App.css
│   └── main.tsx
└── README.md
```

---

## 🛠️ Troubleshooting

### "Refused to connect" on HF Spaces
- Click **Factory rebuild** in Settings
- Use `nginxinc/nginx-unprivileged:alpine` image (already configured)

### Build fails on HF Spaces
- Ensure `app_file: Dockerfile` is in README frontmatter
- Ensure `app_port: 7860` matches the EXPOSE in Dockerfile

### Local Docker issues
```bash
# Clean rebuild
docker compose down
docker compose build --no-cache
docker compose up
```

---

## 📜 License

MIT License - Free for research and commercial use.

---

## 🙏 Contributing

Contributions welcome! Areas of interest:
- Additional Kashmiri diacritic patterns
- Performance optimizations
- UI/UX improvements
- Documentation in Kashmiri

---

Built with ❤️ for Kashmiri NLP research and language preservation.
