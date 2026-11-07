// Feature table data — transcribed from Figma frames 97:11244 … 98:15354 (10d · Feature table).
// Cell values: a string = included (shows a tick + the value), X = not included, NA = not stated.
export const X = 0
export const NA = null

export const FEATURE_TABLES = {
  "health": {
    label: "Health",
    groups: [
      { name: "Coverage", icon: "shield", features: ["In-patient hospitalisation", "Pre-hospitalisation", "Post-hospitalisation", "Day-care procedures", "AYUSH treatment", "Maternity cover", "Newborn cover", "OPD cover", "Domiciliary treatment", "Road ambulance"] },
      { name: "Waiting periods", icon: "clock", features: ["Initial waiting", "Pre-existing disease", "Specific diseases", "Maternity waiting"] },
      { name: "Limits and costs", icon: "card", features: ["Room rent", "Co-pay", "ICU limit"] },
      { name: "Extras and claims", icon: "star", features: ["Restore benefit", "No-claim bonus", "Free health check-up", "Worldwide cover", "Claim settlement ratio", "Network hospitals"] },
    ],
    products: [
      { insurer: "Niva Bupa", name: "CareFirst Family", bg: "#fde8ec", verified: true, mine: false, variants: [
        { label: "Silver", price: "from ₹11,420", color: "#b4325a", checked: false,
          values: ["Up to SI", "30 days", "60 days", "All listed", X, X, X, X, X, "₹2,000", "30 days", "4 years", "2 years", NA, "1% of SI", "10%", "2% of SI", X, "10% / yr", X, X, "91.2%", "10,200"] },
        { label: "Gold", price: "from ₹14,900", color: "#b4325a", checked: true,
          values: ["Up to SI", "60 days", "180 days", "All listed", "Up to SI", "Rider", "Day 1", "₹2,500", "Included", "₹3,000", "30 days", "3 years", "2 years", "4 years", "No limit", "0%", "No limit", "Unlimited", "50% / yr", "Every year", X, "91.2%", "10,200"] },
        { label: "Platinum", price: "from ₹21,700", color: "#b4325a", checked: true,
          values: ["Up to SI", "90 days", "180 days", "All listed", "Up to SI", "₹50,000", "Day 1", "₹5,000", "Included", "Actuals", "30 days", "2 years", "2 years", "2 years", "No limit", "0%", "No limit", "Unlimited", "100% / yr", "Every year", "Emergency", "91.2%", "10,200"] },
        { label: "Senior 60+", price: "from ₹28,300", color: "#b4325a", checked: false,
          values: ["Up to SI", "60 days", "90 days", "All listed", "₹25,000", X, "Day 16", X, "Included", "₹2,500", "30 days", "3 years", "2 years", NA, "Single pvt", "20%", "No limit", "Once a year", "25% / yr", "Every year", X, "91.2%", "10,200"] },
      ] },
      { insurer: "Star Health", name: "FamilySure", bg: "#fde8c9", verified: true, mine: false, variants: [
        { label: "Classic", price: "from ₹10,900", color: "#8a5a12", checked: false,
          values: ["Up to SI", "60 days", "90 days", "All listed", "₹25,000", X, "Day 16", X, "Included", "₹2,500", "30 days", "3 years", "2 years", NA, "Single pvt", "0%", "No limit", "Once a year", "25% / yr", "Every year", X, "82.3%", "14,000"] },
        { label: "Plus", price: "from ₹12,868", color: "#8a5a12", checked: false,
          values: ["Up to SI", "60 days", "180 days", "All listed", "Up to SI", "Rider", "Day 1", "₹2,500", "Included", "₹3,000", "30 days", "3 years", "2 years", "4 years", "No limit", "0%", "No limit", "Unlimited", "50% / yr", "Every year", X, "82.3%", "14,000"] },
      ] },
      { insurer: "HDFC ERGO", name: "SecurePlus", bg: "#e9e3fc", verified: true, mine: false, variants: [
        { label: "Secure", price: "from ₹16,900", color: "#5b3fb8", checked: false,
          values: ["Up to SI", "60 days", "180 days", "All listed", "Up to SI", "Rider", "Day 1", "₹2,500", "Included", "₹3,000", "30 days", "3 years", "2 years", "4 years", "No limit", "0%", "No limit", "Unlimited", "50% / yr", "Every year", X, "98.6%", "13,000"] },
        { label: "Secure Global", price: "from ₹24,100", color: "#5b3fb8", checked: false,
          values: ["Up to SI", "90 days", "180 days", "All listed", "Up to SI", "₹50,000", "Day 1", "₹5,000", "Included", "Actuals", "30 days", "2 years", "2 years", "2 years", "No limit", "0%", "No limit", "Unlimited", "100% / yr", "Every year", "Emergency", "98.6%", "13,000"] },
        { label: "Senior", price: "from ₹26,500", color: "#5b3fb8", checked: false,
          values: ["Up to SI", "60 days", "90 days", "All listed", "₹25,000", X, "Day 16", X, "Included", "₹2,500", "30 days", "3 years", "2 years", NA, "Single pvt", "20%", "No limit", "Once a year", "25% / yr", "Every year", X, "98.6%", "13,000"] },
      ] },
      { insurer: "Star Health", name: "YoungCover", bg: "#d9eafd", verified: true, mine: false, variants: [
        { label: "Standard", price: "from ₹5,600", color: "#1f5fd6", checked: false,
          values: ["Up to SI", "30 days", "60 days", "All listed", X, X, X, X, X, "₹2,000", "30 days", "4 years", "2 years", NA, "1% of SI", "10%", "2% of SI", X, "10% / yr", X, X, "82.3%", "14,000"] },
        { label: "Plus", price: "from ₹6,700", color: "#1f5fd6", checked: false,
          values: ["Up to SI", "60 days", "90 days", "All listed", "₹25,000", X, "Day 16", X, "Included", "₹2,500", "30 days", "3 years", "2 years", NA, "Single pvt", "0%", "No limit", "Once a year", "25% / yr", "Every year", X, "82.3%", "14,000"] },
      ] },
      { insurer: "Care Health", name: "Supreme Plus", bg: "#d4f1e7", verified: true, mine: false, chip: { text: "Code expired", bg: "#fbf1e1", color: "#8a5a12" }, variants: [
        { label: "Supreme", price: "from ₹15,200", color: "#127650", checked: false,
          values: ["Up to SI", "60 days", "180 days", "All listed", "Up to SI", "Rider", "Day 1", "₹2,500", "Included", "₹3,000", "30 days", "3 years", "2 years", "4 years", "No limit", "0%", "No limit", "Unlimited", "50% / yr", "Every year", X, "93.1%", "11,400"] },
        { label: "Supreme Plus", price: "from ₹19,800", color: "#127650", checked: false,
          values: ["Up to SI", "90 days", "180 days", "All listed", "Up to SI", "₹50,000", "Day 1", "₹5,000", "Included", "Actuals", "30 days", "2 years", "2 years", "2 years", "No limit", "0%", "No limit", "Unlimited", "100% / yr", "Every year", "Emergency", "93.1%", "11,400"] },
      ] },
      { insurer: "Niva Bupa", name: "Companion Classic", bg: "#eef1f5", verified: true, mine: false, chip: { text: "Withdrawn", bg: "#fbebec", color: "#b4323c" }, variants: [
        { label: "Classic", price: "from —", color: "#44526a", checked: false,
          values: ["Up to SI", "30 days", "60 days", "All listed", X, X, X, X, X, "₹2,000", "30 days", "4 years", "2 years", NA, "1% of SI", "10%", "2% of SI", X, "10% / yr", X, X, "91.2%", "10,200"] },
      ] },
      { insurer: "Star Health · My product", name: "Arogya Plus", bg: "#fbd5dd", verified: false, mine: true, variants: [
        { label: "Classic", price: "from ₹9,800", color: "#b4325a", checked: false,
          values: ["Up to SI", "60 days", "90 days", "All listed", "₹25,000", X, "Day 16", X, "Included", "₹2,500", "30 days", "3 years", "2 years", NA, "Single pvt", "0%", "No limit", "Once a year", "25% / yr", "Every year", X, "82.3%", "14,000"] },
        { label: "Plus", price: "from ₹12,400", color: "#b4325a", checked: false,
          values: ["Up to SI", "60 days", "180 days", "All listed", "Up to SI", "Rider", "Day 1", "₹2,500", "Included", "₹3,000", "30 days", "3 years", "2 years", "4 years", "No limit", "0%", "No limit", "Unlimited", "50% / yr", "Every year", X, "82.3%", "14,000"] },
      ] },
      { insurer: "Star Health · My product", name: "Arogya Basic", bg: "#fff3d6", verified: false, mine: true, variants: [
        { label: "Standard", price: "from ₹7,900", color: "#8a5a12", checked: false,
          values: ["Up to SI", "30 days", "60 days", "All listed", X, X, X, X, X, "₹2,000", "30 days", "4 years", "2 years", NA, "1% of SI", "10%", "2% of SI", X, "10% / yr", X, X, "82.3%", "14,000"] },
      ] },
    ],
  },
  "motor": {
    label: "Motor",
    emptyTitle: "No motor products of your own",
    groups: [
      { name: "Cover", icon: "shield", features: ["Third-party liability", "Own damage", "Owner-driver accident cover", "Theft and fire", "Natural calamities"] },
      { name: "Add-ons", icon: "plus", features: ["Zero depreciation", "Engine protection", "Return to invoice", "Consumables", "Roadside assistance", "Key replacement", "NCB protection"] },
      { name: "Claims", icon: "star", features: ["No-claim bonus", "Cashless garages", "Claim settlement ratio"] },
    ],
    products: [
      { insurer: "ICICI Lombard", name: "Private Car Package", bg: "#d9eafd", verified: true, mine: false, variants: [
        { label: "Third-party only", price: "from ₹3,416", color: "#1f5fd6", checked: false,
          values: ["Unlimited", X, "₹15 lakh", X, X, X, X, X, X, X, X, X, X, "5,900", "96.0%"] },
        { label: "Comprehensive", price: "from ₹11,240", color: "#1f5fd6", checked: true,
          values: ["Unlimited", "Up to IDV", "₹15 lakh", "Included", "Included", X, "Add-on", X, X, "24×7", X, "Add-on", "Up to 50%", "5,900", "96.0%"] },
        { label: "Zero-dep Plus", price: "from ₹13,263", color: "#1f5fd6", checked: true,
          values: ["Unlimited", "Up to IDV", "₹15 lakh", "Included", "Included", "Included", "Included", "Add-on", "Included", "24×7", "₹25,000", "Included", "Up to 50%", "5,900", "96.0%"] },
      ] },
      { insurer: "HDFC ERGO", name: "Two-wheeler Shield", bg: "#e9e3fc", verified: true, mine: false, variants: [
        { label: "Third-party", price: "from ₹714", color: "#5b3fb8", checked: false,
          values: ["Unlimited", X, "₹15 lakh", X, X, X, X, X, X, X, X, X, X, "8,000", "98.6%"] },
        { label: "Comprehensive", price: "from ₹1,890", color: "#5b3fb8", checked: false,
          values: ["Unlimited", "Up to IDV", "₹15 lakh", "Included", "Included", X, "Add-on", X, X, "24×7", X, "Add-on", "Up to 50%", "8,000", "98.6%"] },
      ] },
      { insurer: "Tata AIG", name: "Auto Secure", bg: "#d4f1e7", verified: true, mine: false, variants: [
        { label: "Standard", price: "from ₹10,600", color: "#127650", checked: false,
          values: ["Unlimited", "Up to IDV", "₹15 lakh", "Included", "Included", X, "Add-on", X, X, "24×7", X, "Add-on", "Up to 50%", "7,500", "95.2%"] },
        { label: "Zero-dep", price: "from ₹12,950", color: "#127650", checked: false,
          values: ["Unlimited", "Up to IDV", "₹15 lakh", "Included", "Included", "Included", "Included", "Add-on", "Included", "24×7", "₹25,000", "Included", "Up to 50%", "7,500", "95.2%"] },
      ] },
    ],
  },
  "life-and-term": {
    label: "Life and Term",
    emptyTitle: "No life and term products of your own",
    groups: [
      { name: "Cover", icon: "shield", features: ["Death benefit", "Terminal illness", "Accidental death", "Critical illness", "Waiver of premium"] },
      { name: "Plan options", icon: "list", features: ["Return of premium", "Payout type", "Cover till age", "Medicals needed"] },
      { name: "Claims", icon: "star", features: ["Claim settlement ratio"] },
    ],
    products: [
      { insurer: "HDFC Life", name: "Click 2 Protect", bg: "#e9e3fc", verified: true, mine: false, variants: [
        { label: "Life", price: "from ₹9,800", color: "#5b3fb8", checked: false,
          values: ["Sum assured", "Paid early", X, X, X, X, "Lump sum", "75", "Above ₹50L", "99.4%"] },
        { label: "Life Plus", price: "from ₹11,600", color: "#5b3fb8", checked: true,
          values: ["Sum assured", "Paid early", "Rider", "Rider", "Included", X, "Lump sum", "85", "Above ₹50L", "99.4%"] },
        { label: "Income", price: "from ₹12,900", color: "#5b3fb8", checked: false,
          values: ["Sum assured", "Paid early", "Included", "Rider", "Included", "Included", "Monthly income", "99", "Above ₹1Cr", "99.4%"] },
      ] },
      { insurer: "ICICI Prudential", name: "iProtect Smart", bg: "#fde8c9", verified: true, mine: false, variants: [
        { label: "Smart", price: "from ₹10,200", color: "#8a5a12", checked: false,
          values: ["Sum assured", "Paid early", X, X, X, X, "Lump sum", "75", "Above ₹50L", "98.6%"] },
        { label: "Smart Plus", price: "from ₹12,400", color: "#8a5a12", checked: true,
          values: ["Sum assured", "Paid early", "Rider", "Rider", "Included", X, "Lump sum", "85", "Above ₹50L", "98.6%"] },
      ] },
      { insurer: "Max Life", name: "Smart Term", bg: "#fde8ec", verified: true, mine: false, variants: [
        { label: "Base", price: "from ₹9,400", color: "#b4325a", checked: false,
          values: ["Sum assured", "Paid early", X, X, X, X, "Lump sum", "75", "Above ₹50L", "99.5%"] },
        { label: "Plus", price: "from ₹11,900", color: "#b4325a", checked: false,
          values: ["Sum assured", "Paid early", "Included", "Rider", "Included", "Included", "Monthly income", "99", "Above ₹1Cr", "99.5%"] },
      ] },
    ],
  },
  "travel": {
    label: "Travel",
    emptyTitle: "No travel products of your own",
    groups: [
      { name: "Medical", icon: "heart", features: ["Medical expenses", "Emergency evacuation", "Pre-existing emergency", "Covid cover"] },
      { name: "Trip", icon: "plane", features: ["Trip cancellation", "Trip delay", "Baggage loss", "Passport loss"] },
      { name: "Extras and claims", icon: "star", features: ["Personal liability", "Adventure sports", "Claim settlement ratio"] },
    ],
    products: [
      { insurer: "ICICI Lombard", name: "Explore", bg: "#d9eafd", verified: true, mine: false, variants: [
        { label: "Asia", price: "from ₹890", color: "#1f5fd6", checked: false,
          values: ["$50,000", "Included", X, "Included", X, X, "$500", "$200", X, X, "96.0%"] },
        { label: "Worldwide ex US", price: "from ₹1,640", color: "#1f5fd6", checked: true,
          values: ["$100,000", "Included", "$5,000", "Included", "$1,000", "$100", "$1,000", "$250", "$50,000", X, "96.0%"] },
        { label: "Worldwide", price: "from ₹2,480", color: "#1f5fd6", checked: false,
          values: ["$250,000", "Included", "$10,000", "Included", "$2,500", "$200", "$1,500", "$300", "$100,000", "Included", "96.0%"] },
      ] },
      { insurer: "Tata AIG", name: "Travel Guard", bg: "#d4f1e7", verified: true, mine: false, variants: [
        { label: "Silver", price: "from ₹980", color: "#127650", checked: false,
          values: ["$50,000", "Included", X, "Included", X, X, "$500", "$200", X, X, "95.2%"] },
        { label: "Gold", price: "from ₹1,720", color: "#127650", checked: true,
          values: ["$100,000", "Included", "$5,000", "Included", "$1,000", "$100", "$1,000", "$250", "$50,000", X, "95.2%"] },
      ] },
    ],
  },
}
