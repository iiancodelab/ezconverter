# 🚀 CI/CD Setup Guide untuk Vercel Deployment

## 📋 **Prerequisites**

1. **GitHub Repository** - Code sudah di push ke GitHub
2. **Vercel Account** - Daftar di [vercel.com](https://vercel.com)
3. **CloudConvert API Key** - Dapatkan di [cloudconvert.com](https://cloudconvert.com)

---

## 🔧 **Setup Steps**

### **1. Setup Vercel Project**

1. **Import ke Vercel:**
   ```bash
   # Connect GitHub repo ke Vercel
   # Atau manual di vercel.com dashboard
   ```

2. **Get Vercel Credentials:**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login dan link project
   vercel login
   vercel link
   
   # Get project info
   cat .vercel/project.json
   ```

### **2. Setup GitHub Secrets**

Di GitHub repo → Settings → Secrets and Variables → Actions:

**Repository Secrets:**
```
VERCEL_TOKEN=your_vercel_token_here
VERCEL_ORG_ID=team_xxx (dari .vercel/project.json)
VERCEL_PROJECT_ID=prj_xxx (dari .vercel/project.json)
CLOUDCONVERT_API_KEY=your_cloudconvert_api_key_here
```

**Repository Variables:**
```
NEXT_PUBLIC_URL=https://your-app.vercel.app
NEXT_PUBLIC_MAX_FILE_SIZE=10485760
```

### **3. Get Vercel Token**

1. **Buka Vercel Settings:**
   ```
   https://vercel.com/account/tokens
   ```

2. **Create New Token:**
   - Name: `GitHub Actions CI/CD`
   - Scope: Full Account
   - Copy token untuk GitHub secrets

### **4. Setup Environment Variables di Vercel**

Di Vercel Dashboard → Project → Settings → Environment Variables:

```bash
# Production Environment
CLOUDCONVERT_API_KEY=your_actual_api_key_here
NEXT_PUBLIC_MAX_FILE_SIZE=10485760
NEXT_PUBLIC_URL=https://your-actual-domain.com
GOOGLE_VERIFICATION=your_google_verification_code (optional)

# Preview Environment  
CLOUDCONVERT_API_KEY=your_actual_api_key_here
NEXT_PUBLIC_MAX_FILE_SIZE=10485760
NEXT_PUBLIC_URL=https://your-app-git-branch.vercel.app
```

---

## ⚡ **Workflow Features**

### **🧪 Testing & Linting**
- ✅ Runs on every push & PR
- ✅ ESLint code quality checks
- ✅ Build verification
- ✅ Fast feedback on code issues

### **🚀 Preview Deployments**
- ✅ Auto-deploy PR ke Vercel preview
- ✅ Comment di PR dengan preview URL
- ✅ Test features sebelum merge

### **🌟 Production Deployments**
- ✅ Auto-deploy ke production saat push ke `main`
- ✅ Environment production yang terpisah
- ✅ Status deployment di GitHub

### **🔍 Lighthouse Audits**
- ✅ Performance monitoring otomatis
- ✅ Audit setelah production deployment
- ✅ Report tersimpan sebagai artifact

---

## 🔄 **Workflow Triggers**

```yaml
# Automatic triggers:
- Push ke branch main        → Production deployment
- Push ke branch develop     → Testing only  
- Pull Request ke main       → Preview deployment + Testing
```

---

## 📊 **Monitoring & Reports**

### **GitHub Actions Tab:**
- Build status dan logs
- Test results
- Deployment status

### **Lighthouse Reports:**
- Download dari Actions artifacts
- Performance score tracking
- Web vitals monitoring

### **Vercel Dashboard:**
- Deployment history
- Performance analytics
- Function logs

---

## 🐛 **Troubleshooting**

### **Common Issues:**

1. **Build Fails:**
   ```bash
   # Check environment variables
   # Verify API keys are correct
   # Check package.json scripts
   ```

2. **Vercel Token Issues:**
   ```bash
   # Regenerate token di Vercel
   # Update GitHub secrets
   # Check token permissions
   ```

3. **Environment Variable Missing:**
   ```bash
   # Add di Vercel dashboard
   # Add di GitHub secrets/variables
   # Trigger new deployment
   ```

### **Debug Commands:**
```bash
# Local testing
npm run build
npm start

# Vercel CLI testing  
vercel dev
vercel --prod

# Check GitHub secrets
# Settings → Secrets → Actions
```

---

## 🎯 **Deployment Checklist**

- [ ] ✅ Code di push ke GitHub
- [ ] ✅ Vercel project connected
- [ ] ✅ GitHub secrets configured
- [ ] ✅ Environment variables set
- [ ] ✅ CloudConvert API key working
- [ ] ✅ First deploy successful
- [ ] ✅ Custom domain configured (optional)
- [ ] ✅ Google verification setup (optional)

---

## 🚀 **Ready to Deploy!**

1. **Push code ke main branch:**
   ```bash
   git add .
   git commit -m "feat: initial deploy with CI/CD"
   git push origin main
   ```

2. **Check GitHub Actions:**
   - Workflow akan jalan otomatis
   - Monitor di tab Actions

3. **Verify Deployment:**
   - Check Vercel dashboard
   - Test aplikasi live
   - Monitor performance

**🎉 Selamat! Aplikasi sudah live dengan CI/CD automation!**