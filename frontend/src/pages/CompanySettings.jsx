import React, { useState, useEffect } from "react";
import { Upload, Building2 } from "lucide-react";

import PanelHeader from "../components/PanelHeader";
import { getCompany, createCompany, updateCompany } from "../Services/Api";
import {
  colors,
  panel,
  pageWrap,
  pageTitle,
  formGrid,
  formGroup,
  formLabel,
  formInput,
  primaryButton,
} from "../styles/theme";

const styles = {
  logoRow:{display:"flex",alignItems:"center",gap:16,marginBottom:20},
  logoPreview:{width:72,height:72,borderRadius:16,background:colors.primaryLight,display:"flex",alignItems:"center",justifyContent:"center",color:colors.primary,flexShrink:0,overflow:"hidden"},
  uploadButton:{display:"inline-flex",alignItems:"center",gap:8,background:colors.bg,border:`1px solid ${colors.border}`,borderRadius:10,padding:"8px 14px",fontSize:13,fontWeight:500,color:colors.textSecondary,cursor:"pointer"},
  sectionTitle:{fontSize:14,fontWeight:600,color:colors.textPrimary,margin:"24px 0 12px"},
  saveRow:{display:"flex",justifyContent:"flex-end",alignItems:"center",gap:12,marginTop:24},
  statusText:{fontSize:13,color:colors.textSecondary},
  errorText:{fontSize:13,color:"#dc2626"},
  fieldError:{fontSize:12,color:"#dc2626",marginTop:4},
  inputError:{borderColor:"#dc2626"},
};

const emptyForm = {
  companyName:"",
  ownerName:"",
  gstNumber:"",
  panNumber:"",
  email:"",
  phone:"",
  address:"",
  city:"",
  state:"",
  country:"India",
  pincode:"",
  bankName:"",
  accountHolderName:"",
  accountNumber:"",
  ifsc:"",
  branchName:"",
  upiId:"",
  invoicePrefix:"INV",
  currency:"INR",
  financialYear:"2026-27",
  logo:"",
};

// ============================================
// Validation rules (mirrors backend CompanyRequest constraints)
// ============================================
const PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[6-9]\d{9}$/,
  gstNumber: /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
  panNumber: /^[A-Z]{5}\d{4}[A-Z]{1}$/,
  pincode: /^\d{6}$/,
  accountNumber: /^\d{9,18}$/,
  ifsc: /^[A-Z]{4}0[A-Z0-9]{6}$/,
  upiId: /^[\w.-]{2,256}@[a-zA-Z]{2,64}$/,
  financialYear: /^\d{4}-\d{2}$/,
};

const REQUIRED_FIELDS = [
  "companyName","ownerName","email","phone","address","city","state",
  "country","pincode","bankName","accountHolderName","accountNumber",
  "ifsc","branchName","invoicePrefix","currency","financialYear",
];

const LABELS = {
  companyName:"Company name", ownerName:"Owner name", email:"Email", phone:"Phone",
  gstNumber:"GST number", panNumber:"PAN number", address:"Address", city:"City",
  state:"State", country:"Country", pincode:"Pincode", bankName:"Bank name",
  accountHolderName:"Account holder name", accountNumber:"Account number",
  ifsc:"IFSC code", branchName:"Branch name", upiId:"UPI ID",
  invoicePrefix:"Invoice prefix", currency:"Currency", financialYear:"Financial year",
};

function validateForm(form){
  const errors = {};

  REQUIRED_FIELDS.forEach((key) => {
    if (!String(form[key] ?? "").trim()) {
      errors[key] = `${LABELS[key]} is required`;
    }
  });

  if (!errors.email && !PATTERNS.email.test(form.email)) {
    errors.email = "Enter a valid email address";
  }
  if (!errors.phone && !PATTERNS.phone.test(form.phone)) {
    errors.phone = "Enter a valid 10-digit Indian phone number";
  }
  if (form.gstNumber && !PATTERNS.gstNumber.test(form.gstNumber)) {
    errors.gstNumber = "Enter a valid GST number";
  }
  if (form.panNumber && !PATTERNS.panNumber.test(form.panNumber)) {
    errors.panNumber = "Enter a valid PAN number";
  }
  if (!errors.pincode && !PATTERNS.pincode.test(form.pincode)) {
    errors.pincode = "Enter a valid 6-digit pincode";
  }
  if (!errors.accountNumber && !PATTERNS.accountNumber.test(form.accountNumber)) {
    errors.accountNumber = "Enter a valid account number (9-18 digits)";
  }
  if (!errors.ifsc && !PATTERNS.ifsc.test(form.ifsc)) {
    errors.ifsc = "Enter a valid IFSC code (e.g. SBIN0001234)";
  }
  if (form.upiId && !PATTERNS.upiId.test(form.upiId)) {
    errors.upiId = "Enter a valid UPI ID (e.g. name@bank)";
  }
  if (!errors.financialYear && !PATTERNS.financialYear.test(form.financialYear)) {
    errors.financialYear = "Use format YYYY-YY, e.g. 2026-27";
  }

  return errors;
}

export default function CompanySettings(){
  const [form,setForm]=useState(emptyForm);
  const [companyExists,setCompanyExists]=useState(false);
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState(false);
  const [error,setError]=useState("");
  const [fieldErrors,setFieldErrors]=useState({});
  const [logoPreview,setLogoPreview]=useState(null);

  useEffect(()=>{
    let mounted = true;
    (async () => {
      try {
        const res = await getCompany();
        if (!mounted) return;
        setForm(prev => ({ ...prev, ...res.data }));
        if (res.data.logo) setLogoPreview(res.data.logo);
        setCompanyExists(true);
      } catch (err) {
        if (err.response?.status !== 404) {
          setError("Failed to load company details.");
          console.error(err);
        }
        setCompanyExists(false);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const update=(field,value)=>{
    setForm(p=>({...p,[field]:value}));
    // clear that field's error as the user types
    if (fieldErrors[field]) {
      setFieldErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleLogo=(e)=>{
    const file=e.target.files?.[0];
    if(!file) return;
    // NOTE: backend currently expects `logo` as a string field on CompanyRequest
    // (e.g. a URL), not a file upload. Wire this up to a real upload endpoint
    // once you add multipart support server-side. For now we just preview it.
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSave=async ()=>{
    setError("");

    const errors = validateForm(form);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setError("Please fix the highlighted fields before saving.");
      return;
    }

    setSaving(true);
    try {
      const payload = { ...form };
      const res = companyExists
        ? await updateCompany(payload)
        : await createCompany(payload);

      setForm(prev => ({ ...prev, ...res.data }));
      setCompanyExists(true);
      alert("Company details saved.");
    } catch (err) {
      console.error(err);
      // backend GlobalExceptionHandler returns { field: message } on 400
      if (err.response?.status === 400 && err.response?.data && typeof err.response.data === "object") {
        setFieldErrors(err.response.data);
        setError("Please fix the highlighted fields before saving.");
      } else {
        setError(err.response?.data?.message || "Failed to save company details.");
      }
    } finally {
      setSaving(false);
    }
  };

  const renderField = (label, key) => (
    <div style={formGroup} key={key}>
      <label style={formLabel}>{label}</label>
      <input
        style={fieldErrors[key] ? { ...formInput, ...styles.inputError } : formInput}
        value={form[key] ?? ""}
        onChange={e=>update(key,e.target.value)}
      />
      {fieldErrors[key] && <span style={styles.fieldError}>{fieldErrors[key]}</span>}
    </div>
  );

  if (loading) {
    return (
      <div style={pageWrap}>
        <h1 style={pageTitle}>Company Settings</h1>
        <div style={panel}><p style={styles.statusText}>Loading...</p></div>
      </div>
    );
  }

  return (
    <div style={pageWrap}>
      <h1 style={pageTitle}>Company Settings</h1>
      <div style={panel}>
        <PanelHeader title="Company Profile"/>

        <div style={styles.logoRow}>
          <div style={styles.logoPreview}>
            {logoPreview
              ? <img src={logoPreview} alt="Logo" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              : <Building2 size={28}/>}
          </div>
          <label style={styles.uploadButton}>
            <Upload size={14}/> Upload Logo
            <input type="file" accept="image/*" style={{display:"none"}} onChange={handleLogo}/>
          </label>
        </div>

        <h3 style={styles.sectionTitle}>Company Information</h3>
        <div style={formGrid}>
          {renderField("Company Name","companyName")}
          {renderField("Owner Name","ownerName")}
          {renderField("GST Number","gstNumber")}
          {renderField("PAN Number","panNumber")}
          {renderField("Email","email")}
          {renderField("Phone","phone")}
        </div>

        <h3 style={styles.sectionTitle}>Address</h3>
        <div style={formGrid}>
          <div style={{...formGroup,gridColumn:"1 / -1"}}>
            <label style={formLabel}>Address</label>
            <input
              style={fieldErrors.address ? { ...formInput, ...styles.inputError } : formInput}
              value={form.address ?? ""}
              onChange={e=>update("address",e.target.value)}
            />
            {fieldErrors.address && <span style={styles.fieldError}>{fieldErrors.address}</span>}
          </div>
          {renderField("City","city")}
          {renderField("State","state")}
          {renderField("Country","country")}
          {renderField("Pincode","pincode")}
        </div>

        <h3 style={styles.sectionTitle}>Bank Details</h3>
        <div style={formGrid}>
          {renderField("Bank Name","bankName")}
          {renderField("Account Holder Name","accountHolderName")}
          {renderField("Account Number","accountNumber")}
          {renderField("IFSC Code","ifsc")}
          {renderField("Branch Name","branchName")}
          {renderField("UPI ID","upiId")}
        </div>

        <h3 style={styles.sectionTitle}>Invoice Settings</h3>
        <div style={formGrid}>
          {renderField("Invoice Prefix","invoicePrefix")}
          {renderField("Currency","currency")}
          {renderField("Financial Year","financialYear")}
        </div>

        <div style={styles.saveRow}>
          {error && <span style={styles.errorText}>{error}</span>}
          <button style={primaryButton} onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}