// Status and screen inventory (Figma 292:38117) — transcribed from the outline
export const inventoryTitle = "Bimayantra · status and screen inventory"
export const inventoryIntro = "Every status and badge in the design, where it comes from, what changes it, what it can become next, and which screens show it. Codes match frame names in this file. Source: BPD v3.2 section 4.3 state transitions."
export const entities = [
 {
  "title": "Account (advisor)",
  "rows": [
   {
    "status": "Active",
    "bg": "#e7f4ee",
    "fg": "#127650",
    "trigger": "OTP verified at sign-up (P-01)",
    "next": "Suspended, Closed",
    "screens": "01, AA1"
   },
   {
    "status": "Suspended",
    "bg": "#fbf1e1",
    "fg": "#8a5a12",
    "trigger": "SkyUp admin, reason + OTP (P-51)",
    "next": "Active, Closed",
    "screens": "A5, AA1, AA3"
   },
   {
    "status": "Closed",
    "bg": "#eef1f5",
    "fg": "#44526a",
    "trigger": "System after read-only period, or admin",
    "next": "— final",
    "screens": "A6, AA1"
   }
  ]
 },
 {
  "title": "OTP challenge",
  "rows": [
   {
    "status": "Issued",
    "bg": "#e8f0fd",
    "fg": "#1f5fd6",
    "trigger": "Advisor asks for a code",
    "next": "Verified, Expired, Replaced, Locked",
    "screens": "A1, 00"
   },
   {
    "status": "Wrong or expired",
    "bg": "#fbebec",
    "fg": "#b4323c",
    "trigger": "Wrong code or 5 minutes passed",
    "next": "Issued (resend)",
    "screens": "A2"
   },
   {
    "status": "Locked",
    "bg": "#fbebec",
    "fg": "#b4323c",
    "trigger": "Too many wrong tries",
    "next": "Unlocks after 30 min",
    "screens": "A3"
   }
  ]
 },
 {
  "title": "Subscription",
  "rows": [
   {
    "status": "Trial",
    "bg": "#e8f0fd",
    "fg": "#1f5fd6",
    "trigger": "Sign-up (P-01)",
    "next": "Active, Expired",
    "screens": "A4, A7, 17, AA1"
   },
   {
    "status": "Active",
    "bg": "#e7f4ee",
    "fg": "#127650",
    "trigger": "SkyUp records payment (P-47)",
    "next": "Grace",
    "screens": "17, AA2, AA4"
   },
   {
    "status": "Grace",
    "bg": "#fbf1e1",
    "fg": "#8a5a12",
    "trigger": "System at end date; full access",
    "next": "Active, Expired",
    "screens": "A8, AA1"
   },
   {
    "status": "Expired (read-only)",
    "bg": "#fbebec",
    "fg": "#b4323c",
    "trigger": "System at trial or grace end",
    "next": "Active, account Closed",
    "screens": "A9, AA1"
   }
  ]
 },
 {
  "title": "Advisor KYC",
  "rows": [
   {
    "status": "Not submitted",
    "bg": "#eef1f5",
    "fg": "#44526a",
    "trigger": "New account",
    "next": "Pending review",
    "screens": "KY1"
   },
   {
    "status": "Pending review",
    "bg": "#f0ecfb",
    "fg": "#5b3fb8",
    "trigger": "Advisor submits (P-06) or changes PAN/licence",
    "next": "Verified, Rejected",
    "screens": "S03, 16, 24"
   },
   {
    "status": "Verified",
    "bg": "#e7f4ee",
    "fg": "#127650",
    "trigger": "Staff or admin approves",
    "next": "Pending review",
    "screens": "KY2, AA1"
   },
   {
    "status": "Rejected",
    "bg": "#fbebec",
    "fg": "#b4323c",
    "trigger": "Staff or admin rejects with reason",
    "next": "Pending review",
    "screens": "KY3, AA5"
   }
  ]
 },
 {
  "title": "Insurer and agent code",
  "rows": [
   {
    "status": "Active",
    "bg": "#e7f4ee",
    "fg": "#127650",
    "trigger": "Advisor adds insurer (P-07)",
    "next": "Inactive",
    "screens": "S04, IN1, Q4"
   },
   {
    "status": "Inactive",
    "bg": "#eef1f5",
    "fg": "#44526a",
    "trigger": "Advisor deactivates",
    "next": "Active",
    "screens": "IN2, IN3"
   },
   {
    "status": "Expires soon / Code expired",
    "bg": "#fbf1e1",
    "fg": "#8a5a12",
    "trigger": "Derived from code end date",
    "next": "Update code",
    "screens": "S04, 10, Q4, 10d"
   }
  ]
 },
 {
  "title": "Lead",
  "rows": [
   {
    "status": "New",
    "bg": "#e8f0fd",
    "fg": "#1f5fd6",
    "trigger": "Lead form (P-12) or referral form (P-46)",
    "next": "Contacted, Follow-up, Lost, Converted",
    "screens": "F1, 02, 02b, 21"
   },
   {
    "status": "Contacted",
    "bg": "#f0ecfb",
    "fg": "#5b3fb8",
    "trigger": "Advisor changes status or logs contact",
    "next": "Qualified, Follow-up, Lost, Converted",
    "screens": "LS1, LS2, 02b"
   },
   {
    "status": "Qualified",
    "bg": "#e7f4ee",
    "fg": "#127650",
    "trigger": "Advisor",
    "next": "Follow-up, Lost, Converted",
    "screens": "02, 02b, F2"
   },
   {
    "status": "Follow-up",
    "bg": "#fbf1e1",
    "fg": "#8a5a12",
    "trigger": "Advisor sets a date",
    "next": "Contacted, Qualified, Lost, Converted",
    "screens": "03, LE1, 02b"
   },
   {
    "status": "Overdue follow-up",
    "bg": "#fbebec",
    "fg": "#b4323c",
    "trigger": "Derived: follow-up date passed",
    "next": "—",
    "screens": "01, 02, 03, TSK"
   },
   {
    "status": "Converted",
    "bg": "#e7f4ee",
    "fg": "#127650",
    "trigger": "Convert to policy holder (P-14)",
    "next": "— final, read-only",
    "screens": "F2, LS6"
   },
   {
    "status": "Lost",
    "bg": "#eef1f5",
    "fg": "#44526a",
    "trigger": "Advisor, reason required",
    "next": "Contacted (reopen with reason)",
    "screens": "LS3, LS4, LS5"
   }
  ]
 },
 {
  "title": "Lead source",
  "rows": [
   {
    "status": "Meta Ads, Google Ads, Website, S…",
    "bg": "#e8f0fd",
    "fg": "#1f5fd6",
    "detail": "Meta Ads, Google Ads, Website, Social media, Referral (client / referrer), Walk-in, Campaign, Manual entry, Other",
    "trigger": "Chosen on lead form; referral form sets Referral",
    "next": "Editable, history kept",
    "screens": "F1, F1b, LE1, 02, 02b, 02c, 01"
   }
  ]
 },
 {
  "title": "Policy holder",
  "rows": [
   {
    "status": "Active",
    "bg": "#e7f4ee",
    "fg": "#127650",
    "trigger": "Created or converted (P-15, P-14)",
    "next": "Inactive",
    "screens": "04, 05"
   },
   {
    "status": "Inactive",
    "bg": "#eef1f5",
    "fg": "#44526a",
    "trigger": "Advisor; blocked while quotations/proposals are open",
    "next": "Active",
    "screens": "CU1, CU2"
   }
  ]
 },
 {
  "title": "Family member",
  "rows": [
   {
    "status": "Active",
    "bg": "#e7f4ee",
    "fg": "#127650",
    "trigger": "Advisor adds member",
    "next": "Inactive",
    "screens": "05a, FD1, FD2"
   },
   {
    "status": "Inactive",
    "bg": "#eef1f5",
    "fg": "#44526a",
    "trigger": "Advisor marks inactive",
    "next": "Active",
    "screens": "PF3, FM1"
   }
  ]
 },
 {
  "title": "Consent (per person, channel)",
  "rows": [
   {
    "status": "Not recorded",
    "bg": "#eef1f5",
    "fg": "#44526a",
    "trigger": "Default",
    "next": "Given",
    "screens": "05b"
   },
   {
    "status": "Given",
    "bg": "#e7f4ee",
    "fg": "#127650",
    "trigger": "Advisor records with proof (P-17)",
    "next": "Withdrawn",
    "screens": "CS1, CS2, CS3"
   },
   {
    "status": "Withdrawn",
    "bg": "#fbebec",
    "fg": "#b4323c",
    "trigger": "Advisor, or system on STOP / unsubscribe",
    "next": "Given",
    "screens": "CS4, CS5"
   },
   {
    "status": "Personal-data consent withdrawn",
    "bg": "#fbebec",
    "fg": "#b4323c",
    "trigger": "Advisor with reason",
    "next": "Given (record again)",
    "screens": "CS6, CS7"
   }
  ]
 },
 {
  "title": "Document version",
  "rows": [
   {
    "status": "Unconfirmed",
    "bg": "#fbf1e1",
    "fg": "#8a5a12",
    "trigger": "Upload; values read by AI",
    "next": "Confirmed",
    "screens": "05c, FD5, FD6, PD1"
   },
   {
    "status": "Confirmed",
    "bg": "#e7f4ee",
    "fg": "#127650",
    "trigger": "User checks values",
    "next": "New version adds Unconfirmed",
    "screens": "PD1, PD2"
   },
   {
    "status": "Missing (Aadhaar / PAN)",
    "bg": "#fbebec",
    "fg": "#b4323c",
    "trigger": "Derived: required type not on file",
    "next": "Uploaded",
    "screens": "05a, FD3, FD6"
   },
   {
    "status": "Label changed",
    "bg": "#e8f0fd",
    "fg": "#1f5fd6",
    "trigger": "Advisor only, logged",
    "next": "—",
    "screens": "DL1"
   }
  ]
 },
 {
  "title": "Vehicle",
  "rows": [
   {
    "status": "Active",
    "bg": "#e7f4ee",
    "fg": "#127650",
    "trigger": "Advisor adds with RC + 4 photos (P-54)",
    "next": "Inactive",
    "screens": "PV1, PV2"
   },
   {
    "status": "Inactive",
    "bg": "#eef1f5",
    "fg": "#44526a",
    "trigger": "Sold or not insured",
    "next": "Active",
    "screens": "VH1"
   }
  ]
 },
 {
  "title": "Task",
  "rows": [
   {
    "status": "Open",
    "bg": "#e8f0fd",
    "fg": "#1f5fd6",
    "trigger": "Advisor creates (P-11)",
    "next": "Done, Cancelled",
    "screens": "01, TK1, TK3, TSK"
   },
   {
    "status": "Overdue",
    "bg": "#fbebec",
    "fg": "#b4323c",
    "trigger": "Derived: open and past due",
    "next": "Done, rescheduled",
    "screens": "01, TSK, TK6"
   },
   {
    "status": "Done",
    "bg": "#e7f4ee",
    "fg": "#127650",
    "trigger": "Ticked or Mark as completed",
    "next": "Open (reopen)",
    "screens": "TK5, TSK"
   },
   {
    "status": "Cancelled",
    "bg": "#eef1f5",
    "fg": "#44526a",
    "trigger": "Cancel task in edit",
    "next": "—",
    "screens": "TK4, TSK"
   }
  ]
 },
 {
  "title": "Notification",
  "rows": [
   {
    "status": "Unread",
    "bg": "#e8f0fd",
    "fg": "#1f5fd6",
    "trigger": "System event",
    "next": "Read",
    "screens": "01b, NTF"
   },
   {
    "status": "Read",
    "bg": "#eef1f5",
    "fg": "#44526a",
    "trigger": "Opened or Mark all read",
    "next": "Removed after 30 days",
    "screens": "NTF"
   }
  ]
 },
 {
  "title": "Product (catalogue)",
  "rows": [
   {
    "status": "Upcoming",
    "bg": "#e8f0fd",
    "fg": "#1f5fd6",
    "trigger": "SkyUp sets launch date",
    "next": "Active",
    "screens": "AD1"
   },
   {
    "status": "Active / Can quote",
    "bg": "#e7f4ee",
    "fg": "#127650",
    "trigger": "Published version + active agent code",
    "next": "Withdrawn",
    "screens": "10, 10c, 10d"
   },
   {
    "status": "Withdrawn",
    "bg": "#fbebec",
    "fg": "#b4323c",
    "trigger": "SkyUp or owner",
    "next": "Active; still usable for renewals",
    "screens": "10, Q5, 10d"
   },
   {
    "status": "New",
    "bg": "#fde8ec",
    "fg": "#b4325a",
    "trigger": "Published in the last 7 days",
    "next": "—",
    "screens": "10e, 01b"
   }
  ]
 },
 {
  "title": "Product version (SkyUp)",
  "rows": [
   {
    "status": "Draft",
    "bg": "#eef1f5",
    "fg": "#44526a",
    "trigger": "Staff/admin creates (ADa)",
    "next": "Pending approval",
    "screens": "ADa, ADb"
   },
   {
    "status": "Pending approval",
    "bg": "#f0ecfb",
    "fg": "#5b3fb8",
    "trigger": "Maker sends (ADc)",
    "next": "Published, Draft (rejected)",
    "screens": "ADc, 23"
   },
   {
    "status": "Published / Live",
    "bg": "#e7f4ee",
    "fg": "#127650",
    "trigger": "A different admin approves",
    "next": "Superseded",
    "screens": "AD1, 22"
   }
  ]
 },
 {
  "title": "Advisor’s own product",
  "rows": [
   {
    "status": "Published · only you",
    "bg": "#e7f4ee",
    "fg": "#127650",
    "trigger": "Saved by advisor (P-22), no approval",
    "next": "New version",
    "screens": "AP6, AP7"
   }
  ]
 },
 {
  "title": "Price version",
  "rows": [
   {
    "status": "Scheduled",
    "bg": "#e8f0fd",
    "fg": "#1f5fd6",
    "trigger": "Advisor saves future start date (P-24)",
    "next": "Current, Cancelled",
    "screens": "PV1, PV2"
   },
   {
    "status": "Current",
    "bg": "#e7f4ee",
    "fg": "#127650",
    "trigger": "Start date reached",
    "next": "Closed",
    "screens": "PV1, 10c"
   },
   {
    "status": "Closed",
    "bg": "#eef1f5",
    "fg": "#44526a",
    "trigger": "Newer version becomes current",
    "next": "—",
    "screens": "PV1"
   },
   {
    "status": "Cancelled",
    "bg": "#eef1f5",
    "fg": "#44526a",
    "trigger": "Advisor before it starts",
    "next": "—",
    "screens": "PV1"
   }
  ]
 },
 {
  "title": "OCR job (brochure / document)",
  "rows": [
   {
    "status": "Reading",
    "bg": "#f0ecfb",
    "fg": "#5b3fb8",
    "trigger": "File uploaded",
    "next": "Review required, Failed",
    "screens": "AP2c, ADa"
   },
   {
    "status": "Review required (auto-filled)",
    "bg": "#f0ecfb",
    "fg": "#5b3fb8",
    "trigger": "Reading finished",
    "next": "Reviewed",
    "screens": "AP3–AP5, ADb"
   },
   {
    "status": "Corrected by you",
    "bg": "#e7f4ee",
    "fg": "#127650",
    "trigger": "User fixes a value",
    "next": "—",
    "screens": "AP3b, AP4b, AP5b, AP5c"
   },
   {
    "status": "Failed",
    "bg": "#fbebec",
    "fg": "#b4323c",
    "trigger": "File unreadable",
    "next": "Queued (retry)",
    "screens": "OC1"
   }
  ]
 },
 {
  "title": "Quotation revision",
  "rows": [
   {
    "status": "Draft",
    "bg": "#eef1f5",
    "fg": "#44526a",
    "trigger": "Wizard started (P-27)",
    "next": "Ready, deleted",
    "screens": "Q1–Q10, 07L, QS9"
   },
   {
    "status": "Ready",
    "bg": "#e8f0fd",
    "fg": "#1f5fd6",
    "trigger": "Generated",
    "next": "Shared, Draft, Cancelled",
    "screens": "Q11, QS1"
   },
   {
    "status": "Shared",
    "bg": "#e8f0fd",
    "fg": "#1f5fd6",
    "trigger": "First share; validity starts",
    "next": "Accepted, Rejected, Expired, Superseded, Cancelled",
    "screens": "08, QS2, 07L"
   },
   {
    "status": "Accepted",
    "bg": "#e7f4ee",
    "fg": "#127650",
    "trigger": "Payment recorded, then Mark accepted",
    "next": "Cancelled (if unpaid)",
    "screens": "08b, 08c, P3"
   },
   {
    "status": "Rejected",
    "bg": "#fbebec",
    "fg": "#b4323c",
    "trigger": "Advisor, reason",
    "next": "Superseded",
    "screens": "QS3, QS4"
   },
   {
    "status": "Expired",
    "bg": "#fbebec",
    "fg": "#b4323c",
    "trigger": "System after 15 days, unpaid",
    "next": "Superseded",
    "screens": "QS5"
   },
   {
    "status": "Superseded",
    "bg": "#eef1f5",
    "fg": "#44526a",
    "trigger": "New revision generated",
    "next": "—",
    "screens": "QS8, 05e"
   },
   {
    "status": "Cancelled",
    "bg": "#eef1f5",
    "fg": "#44526a",
    "trigger": "Advisor, reason",
    "next": "—",
    "screens": "QS6, QS7"
   }
  ]
 },
 {
  "title": "Comparison",
  "rows": [
   {
    "status": "Draft",
    "bg": "#eef1f5",
    "fg": "#44526a",
    "trigger": "CQ wizard",
    "next": "Ready",
    "screens": "CQ2–CQ8"
   },
   {
    "status": "Ready",
    "bg": "#e8f0fd",
    "fg": "#1f5fd6",
    "trigger": "Generated",
    "next": "Shared",
    "screens": "CQ9"
   },
   {
    "status": "Shared",
    "bg": "#e8f0fd",
    "fg": "#1f5fd6",
    "trigger": "First share",
    "next": "Product chosen, Expired",
    "screens": "C2"
   },
   {
    "status": "Product chosen",
    "bg": "#e7f4ee",
    "fg": "#127650",
    "trigger": "Customer picks one",
    "next": "New quotation",
    "screens": "C3, 05e"
   },
   {
    "status": "Expired",
    "bg": "#fbebec",
    "fg": "#b4323c",
    "trigger": "System after validity",
    "next": "—",
    "screens": "CX1"
   }
  ]
 },
 {
  "title": "Premium payment",
  "rows": [
   {
    "status": "Awaiting payment",
    "bg": "#f0ecfb",
    "fg": "#5b3fb8",
    "trigger": "Link or offline method added (P-31)",
    "next": "Paid, Failed, Link expired, Cancelled",
    "screens": "08, P1, 08a"
   },
   {
    "status": "Payment successful / Paid",
    "bg": "#e7f4ee",
    "fg": "#127650",
    "trigger": "Advisor records UTR (P-32)",
    "next": "Reversed",
    "screens": "08b, P3, R5"
   },
   {
    "status": "Failed",
    "bg": "#fbebec",
    "fg": "#b4323c",
    "trigger": "Advisor marks failed",
    "next": "New link",
    "screens": "PY1, PY2"
   },
   {
    "status": "Link expired",
    "bg": "#fbf1e1",
    "fg": "#8a5a12",
    "trigger": "Advisor marks link expired",
    "next": "New link",
    "screens": "PY3"
   },
   {
    "status": "Cancelled",
    "bg": "#eef1f5",
    "fg": "#44526a",
    "trigger": "Quotation cancelled or superseded",
    "next": "—",
    "screens": "QS7, 05g"
   },
   {
    "status": "Reversed",
    "bg": "#fbebec",
    "fg": "#b4323c",
    "trigger": "Recorded by mistake or refunded",
    "next": "Paid (record again)",
    "screens": "PY4, PY5"
   }
  ]
 },
 {
  "title": "Proposal",
  "rows": [
   {
    "status": "Draft",
    "bg": "#eef1f5",
    "fg": "#44526a",
    "trigger": "Started from accepted quotation",
    "next": "Submitted, Cancelled",
    "screens": "R1–R6, PRL"
   },
   {
    "status": "Submitted",
    "bg": "#f0ecfb",
    "fg": "#5b3fb8",
    "trigger": "Advisor confirms insurer submission",
    "next": "Issued, Declined",
    "screens": "R6, R7, PRL"
   },
   {
    "status": "Issued",
    "bg": "#e7f4ee",
    "fg": "#127650",
    "trigger": "Issued policy recorded",
    "next": "—",
    "screens": "L2, PRL"
   },
   {
    "status": "Declined",
    "bg": "#fbebec",
    "fg": "#b4323c",
    "trigger": "Insurer declined, reason",
    "next": "— (policy record Cancelled)",
    "screens": "PRD, PRD2"
   },
   {
    "status": "Cancelled",
    "bg": "#eef1f5",
    "fg": "#44526a",
    "trigger": "Advisor cancels draft",
    "next": "—",
    "screens": "PRC"
   }
  ]
 },
 {
  "title": "Policy",
  "rows": [
   {
    "status": "Awaiting issuance",
    "bg": "#f0ecfb",
    "fg": "#5b3fb8",
    "trigger": "Proposal submitted",
    "next": "Issued, Cancelled",
    "screens": "R7, L1, 05f"
   },
   {
    "status": "Issued",
    "bg": "#e7f4ee",
    "fg": "#127650",
    "trigger": "Policy number + PDF recorded (P-33) or existing policy (P-34)",
    "next": "Expired, Renewed, Cancelled",
    "screens": "L2, 12, PP2"
   },
   {
    "status": "Cancelled",
    "bg": "#fbebec",
    "fg": "#b4323c",
    "trigger": "Insurer cancellation or decline",
    "next": "—",
    "screens": "PO1, PO2, PRD2"
   },
   {
    "status": "Expired",
    "bg": "#fbf1e1",
    "fg": "#8a5a12",
    "trigger": "System after end date",
    "next": "Renewed",
    "screens": "PO3"
   },
   {
    "status": "Renewed",
    "bg": "#e7f4ee",
    "fg": "#127650",
    "trigger": "Renewal policy recorded",
    "next": "—",
    "screens": "PO4, N4"
   }
  ]
 },
 {
  "title": "Nominee list",
  "rows": [
   {
    "status": "Version 1 / 2 (current, previous)",
    "bg": "#e8f0fd",
    "fg": "#1f5fd6",
    "trigger": "Advisor saves with endorsement",
    "next": "New version",
    "screens": "12, PP1"
   }
  ]
 },
 {
  "title": "Renewal cycle",
  "rows": [
   {
    "status": "Upcoming",
    "bg": "#eef1f5",
    "fg": "#44526a",
    "trigger": "Policy issued",
    "next": "Due",
    "screens": "L2, 05h"
   },
   {
    "status": "Due",
    "bg": "#fbf1e1",
    "fg": "#8a5a12",
    "trigger": "System, 60 days before expiry",
    "next": "In follow-up, Not renewing, Renewed, Lapsed",
    "screens": "N1, 13"
   },
   {
    "status": "In follow-up",
    "bg": "#f0ecfb",
    "fg": "#5b3fb8",
    "trigger": "Contact logged or renewal quotation started",
    "next": "Renewed, Not renewing, Lapsed",
    "screens": "RS1, N2, RN0"
   },
   {
    "status": "Not renewing",
    "bg": "#eef1f5",
    "fg": "#44526a",
    "trigger": "Advisor, reason",
    "next": "In follow-up (reopen before grace end)",
    "screens": "N3, RS2, RS3"
   },
   {
    "status": "Renewed",
    "bg": "#e7f4ee",
    "fg": "#127650",
    "trigger": "Renewal policy recorded",
    "next": "—",
    "screens": "N4, RNB4"
   },
   {
    "status": "Lapsed",
    "bg": "#fbebec",
    "fg": "#b4323c",
    "trigger": "System after grace end",
    "next": "Renewed (if revived)",
    "screens": "RS4, 13"
   },
   {
    "status": "Reminders paused",
    "bg": "#fbf1e1",
    "fg": "#8a5a12",
    "trigger": "Advisor pauses",
    "next": "Resumes on date",
    "screens": "RS5"
   }
  ]
 },
 {
  "title": "Outgoing message",
  "rows": [
   {
    "status": "Queued",
    "bg": "#f0ecfb",
    "fg": "#5b3fb8",
    "trigger": "System job or advisor action",
    "next": "Sent, Skipped, Cancelled",
    "screens": "CM1"
   },
   {
    "status": "Cancelled",
    "bg": "#eef1f5",
    "fg": "#44526a",
    "trigger": "Advisor, or consent withdrawn",
    "next": "—",
    "screens": "CM4, CS4"
   },
   {
    "status": "Skipped",
    "bg": "#fbf1e1",
    "fg": "#8a5a12",
    "trigger": "Check failed at send time",
    "next": "—",
    "screens": "14"
   },
   {
    "status": "Sent / Delivered / Read",
    "bg": "#e7f4ee",
    "fg": "#127650",
    "trigger": "Provider updates",
    "next": "—",
    "screens": "CM2, CM3"
   },
   {
    "status": "Failed",
    "bg": "#fbebec",
    "fg": "#b4323c",
    "trigger": "Permanent failure",
    "next": "Resend once",
    "screens": "14"
   },
   {
    "status": "Status unknown",
    "bg": "#fbf1e1",
    "fg": "#8a5a12",
    "trigger": "No update in 48 h",
    "next": "—",
    "screens": "14"
   },
   {
    "status": "Shared manually",
    "bg": "#eef1f5",
    "fg": "#44526a",
    "trigger": "Sent from advisor’s own app",
    "next": "— (not tracked)",
    "screens": "CM2, Q11"
   }
  ]
 },
 {
  "title": "Message template (SkyUp)",
  "rows": [
   {
    "status": "Draft / Pending approval / Submi…",
    "bg": "#f0ecfb",
    "fg": "#5b3fb8",
    "detail": "Draft / Pending approval / Submitted to Meta / Active / Rejected / Inactive",
    "trigger": "Admin creates; Meta or second admin approves",
    "next": "Active ↔ Inactive; Rejected → Draft",
    "screens": "AA8"
   }
  ]
 },
 {
  "title": "Referral link and submission",
  "rows": [
   {
    "status": "Active link",
    "bg": "#e7f4ee",
    "fg": "#127650",
    "trigger": "Advisor adds referrer (P-44)",
    "next": "Expired, Revoked",
    "screens": "21, S07"
   },
   {
    "status": "Revoked / Expired",
    "bg": "#eef1f5",
    "fg": "#44526a",
    "trigger": "New link, referrer disabled, or 365 days",
    "next": "—",
    "screens": "RF1, RF2, RX1"
   },
   {
    "status": "Submission: New / In progress / …",
    "bg": "#e8f0fd",
    "fg": "#1f5fd6",
    "detail": "Submission: New / In progress / Policy taken / Already known",
    "trigger": "Referral form (P-46)",
    "next": "Follows the lead",
    "screens": "20, 21"
   }
  ]
 },
 {
  "title": "People (referrer, assistant, SkyUp user)",
  "rows": [
   {
    "status": "Invited",
    "bg": "#e8f0fd",
    "fg": "#1f5fd6",
    "trigger": "Invite sent",
    "next": "Active",
    "screens": "S07, AA9"
   },
   {
    "status": "Active",
    "bg": "#e7f4ee",
    "fg": "#127650",
    "trigger": "First OTP login",
    "next": "Disabled",
    "screens": "S06, S07, AA9"
   },
   {
    "status": "Disabled",
    "bg": "#eef1f5",
    "fg": "#44526a",
    "trigger": "Inviter or admin; ends sessions",
    "next": "Active",
    "screens": "AS1, AS2, RF3, AA9"
   }
  ]
 },
 {
  "title": "Approvals and configuration (SkyUp)",
  "rows": [
   {
    "status": "Pending approval",
    "bg": "#f0ecfb",
    "fg": "#5b3fb8",
    "trigger": "Maker submits",
    "next": "Applied/Published, Rejected",
    "screens": "22, 23, AA10"
   },
   {
    "status": "Applied",
    "bg": "#e7f4ee",
    "fg": "#127650",
    "trigger": "A different admin approves with OTP",
    "next": "—",
    "screens": "AA10, AD1"
   },
   {
    "status": "Rejected",
    "bg": "#fbebec",
    "fg": "#b4323c",
    "trigger": "Admin rejects with reason",
    "next": "Draft",
    "screens": "AA10"
   }
  ]
 },
 {
  "title": "Product correction",
  "rows": [
   {
    "status": "Submitted",
    "bg": "#f0ecfb",
    "fg": "#5b3fb8",
    "trigger": "Advisor suggests (P-58)",
    "next": "Accepted, Rejected",
    "screens": "AA7, AA6"
   },
   {
    "status": "Accepted / Rejected",
    "bg": "#e7f4ee",
    "fg": "#127650",
    "trigger": "SkyUp reviews",
    "next": "—",
    "screens": "AA6"
   }
  ]
 },
 {
  "title": "Support access grant",
  "rows": [
   {
    "status": "Active",
    "bg": "#e7f4ee",
    "fg": "#127650",
    "trigger": "Advisor gives access with OTP (P-57)",
    "next": "Ended, Expired",
    "screens": "SA1, S08, AA13"
   },
   {
    "status": "Ended / Expired",
    "bg": "#eef1f5",
    "fg": "#44526a",
    "trigger": "Advisor ends, or after 24 h",
    "next": "—",
    "screens": "S08, AA13"
   },
   {
    "status": "Refused (no grant)",
    "bg": "#fbebec",
    "fg": "#b4323c",
    "trigger": "SkyUp opens without access; logged",
    "next": "—",
    "screens": "AA13"
   }
  ]
 },
 {
  "title": "Export job",
  "rows": [
   {
    "status": "Being prepared",
    "bg": "#f0ecfb",
    "fg": "#5b3fb8",
    "trigger": "Advisor requests with OTP (P-52)",
    "next": "Ready, Failed",
    "screens": "S09"
   },
   {
    "status": "Ready",
    "bg": "#e7f4ee",
    "fg": "#127650",
    "trigger": "File built",
    "next": "Download expired",
    "screens": "EX1"
   },
   {
    "status": "Link expired",
    "bg": "#eef1f5",
    "fg": "#44526a",
    "trigger": "After 24 h",
    "next": "—",
    "screens": "S09"
   }
  ]
 },
 {
  "title": "Wallet transaction",
  "rows": [
   {
    "status": "Pending",
    "bg": "#f0ecfb",
    "fg": "#5b3fb8",
    "trigger": "Recharge started",
    "next": "Success, Failed",
    "screens": "WL1"
   },
   {
    "status": "Success",
    "bg": "#e7f4ee",
    "fg": "#127650",
    "trigger": "Gateway confirms; debits on send",
    "next": "—",
    "screens": "S05"
   },
   {
    "status": "Failed",
    "bg": "#fbebec",
    "fg": "#b4323c",
    "trigger": "Bank declined",
    "next": "Try again",
    "screens": "WL2"
   }
  ]
 },
 {
  "title": "Public pages",
  "rows": [
   {
    "status": "Quotation page live",
    "bg": "#e7f4ee",
    "fg": "#127650",
    "trigger": "Shared link opened",
    "next": "Expired",
    "screens": "19"
   },
   {
    "status": "Link expired or invalid",
    "bg": "#fbf1e1",
    "fg": "#8a5a12",
    "trigger": "Validity passed or quotation cancelled",
    "next": "—",
    "screens": "QX1"
   }
  ]
 }
]
export const legend = [
 {
  "codes": "00–24",
  "text": "Core screens (login, dashboard, leads, policy holders, quotations, policies, renewals, settings, public, admin)"
 },
 {
  "codes": "F · Q · CQ · C · P · R · L · N · RN",
  "text": "Flows: lead→customer, quotation, comparative quotation, comparison, payment, proposal, policy, renewal, renewal quotation"
 },
 {
  "codes": "05a–05i · PE · PF · PD · PV · PP · PA · FD · CS",
  "text": "Policy holder tabs and every tab action, family, documents, consent"
 },
 {
  "codes": "AP · AD · ADa–ADc · 10b–10e",
  "text": "Products: add my product, SkyUp product publishing, compare, detail, feature table"
 },
 {
  "codes": "TK · TSK · NTF · LE · F1b · 02b–02c · R1–R5 (responsive)",
  "text": "Tasks and reminders, notifications, lead source and list, tablet and mobile"
 },
 {
  "codes": "A1–A9 · LS · QS · PY · PRL · PRD · PRC · PO · RS · CU · FM · DL · VH · CM · KY · IN · PV · SA · EX · WL · RF · AS · AA · QX · RX · OC · CX",
  "text": "Screens added in this review to cover every status and transition"
 }
]
// screen code -> route (first frame with that code)
export const screenLinks = {
 "00": "/login",
 "01": "/",
 "01b": "/x/01b-dashboard-new-product-from-skyup",
 "02": "/leads",
 "02b": "/x/02b-leads-list",
 "02c": "/x/02c-leads-list-filtered-by-source",
 "03": "/leads/1",
 "04": "/customers",
 "05": "/customers/1",
 "05a": "/x/05a-customer-family",
 "05b": "/x/05b-customer-consent",
 "05c": "/x/05c-customer-documents",
 "05e": "/x/05e-customer-quotations",
 "05f": "/x/05f-customer-policies",
 "05g": "/x/05g-customer-payments",
 "05h": "/x/05h-customer-renewals",
 "07L": "/quotations",
 "08": "/quotations/1",
 "08a": "/x/08a-quotation-detail-record-payment",
 "08b": "/x/08b-quotation-detail-payment-successful",
 "08c": "/x/08c-quotation-detail-accepted",
 "10": "/products",
 "10c": "/products/1",
 "10d": "/x/10d-feature-table-health-all",
 "10e": "/x/10e-products-new-from-skyup",
 "12": "/policies/1",
 "13": "/renewals",
 "14": "/communications",
 "16": "/settings",
 "17": "/x/17-settings-plan-and-billing",
 "19": "/q/QT-1042",
 "20": "/r/suresh-rao",
 "21": "/referrer",
 "22": "/admin",
 "23": "/x/23-skyup-admin-approvals",
 "24": "/x/24-skyup-admin-advisor-kyc",
 "A1": "/x/a1-login-mobile-number",
 "A2": "/x/a2-login-wrong-or-expired-code",
 "A3": "/x/a3-login-number-locked",
 "A4": "/x/a4-sign-up-start-free-trial",
 "A5": "/x/a5-account-suspended",
 "A6": "/x/a6-account-closed",
 "A7": "/x/a7-subscription-trial-ending",
 "A8": "/x/a8-subscription-grace-period",
 "A9": "/x/a9-subscription-expired-read-only",
 "AA1": "/x/aa1-admin-advisor-accounts",
 "AA10": "/x/aa10-admin-configuration",
 "AA13": "/x/aa13-admin-support-access",
 "AA2": "/x/aa2-admin-account-detail",
 "AA3": "/x/aa3-admin-suspend-account",
 "AA4": "/x/aa4-admin-record-subscription-payment",
 "AA5": "/x/aa5-admin-reject-kyc",
 "AA6": "/x/aa6-admin-product-corrections",
 "AA7": "/x/aa7-advisor-suggest-correction",
 "AA8": "/x/aa8-admin-message-templates",
 "AA9": "/x/aa9-admin-skyup-users",
 "AD1": "/x/ad1-skyup-admin-catalogue-product-published",
 "ADa": "/x/ada-skyup-admin-add-product-reading-brochure",
 "ADb": "/x/adb-skyup-admin-review-extracted-values",
 "ADc": "/x/adc-skyup-admin-review-and-send-for-approval",
 "AP2c": "/x/ap2c-add-product-reading-brochure",
 "AP3b": "/x/ap3b-add-product-fix-value-launch-date",
 "AP4b": "/x/ap4b-add-product-fix-value-plus-sum-insured",
 "AP5b": "/x/ap5b-add-product-fix-value-opd",
 "AP5c": "/x/ap5c-add-product-features-ticked-fixed-adding",
 "AP6": "/x/ap6-add-product-review-and-submit",
 "AP7": "/x/ap7-products-published",
 "AS1": "/x/as1-assistant-disable",
 "AS2": "/x/as2-assistant-disabled",
 "C2": "/x/c2-comparison-shared",
 "C3": "/x/c3-comparison-customer-chose",
 "CM1": "/x/cm1-communications-scheduled",
 "CM2": "/x/cm2-communications-sent",
 "CM3": "/x/cm3-message-detail",
 "CM4": "/x/cm4-cancel-scheduled-message",
 "CQ9": "/x/cq9-comparison-generated",
 "CS1": "/x/cs1-record-consent",
 "CS2": "/x/cs2-consent-recorded",
 "CS3": "/x/cs3-consent-proof",
 "CS4": "/x/cs4-withdraw-consent",
 "CS5": "/x/cs5-consent-withdrawn",
 "CS6": "/x/cs6-withdraw-personal-data-consent",
 "CS7": "/x/cs7-personal-data-consent-withdrawn",
 "CU1": "/x/cu1-policy-holder-deactivate-blocked",
 "CU2": "/x/cu2-policy-holder-inactive",
 "CX1": "/x/cx1-comparison-expired",
 "DL1": "/x/dl1-document-change-label",
 "EX1": "/x/ex1-export-ready-to-download",
 "F1": "/x/f1-new-lead",
 "F1b": "/x/f1b-new-lead-lead-source-options",
 "F2": "/x/f2-convert-lead-to-customer",
 "FD1": "/x/fd1-add-family-member",
 "FD2": "/x/fd2-family-member-added",
 "FD3": "/x/fd3-add-document-whose-document",
 "FD5": "/x/fd5-add-document-upload",
 "FD6": "/x/fd6-arjun-hegde-documents",
 "FM1": "/x/fm1-family-member-inactive",
 "IN1": "/x/in1-my-insurers-add-insurer",
 "IN2": "/x/in2-my-insurers-deactivate",
 "IN3": "/x/in3-my-insurers-inactive-insurer",
 "KY1": "/x/ky1-kyc-not-submitted",
 "KY2": "/x/ky2-kyc-verified",
 "KY3": "/x/ky3-kyc-rejected",
 "L1": "/x/l1-record-issued-policy",
 "L2": "/x/l2-policy-issued",
 "LE1": "/x/le1-edit-lead",
 "LS1": "/x/ls1-lead-change-status",
 "LS2": "/x/ls2-lead-log-contact",
 "LS3": "/x/ls3-lead-mark-as-lost",
 "LS4": "/x/ls4-lead-lost",
 "LS5": "/x/ls5-lead-reopen",
 "LS6": "/x/ls6-lead-converted",
 "N1": "/x/n1-renewal-detail",
 "N2": "/x/n2-renewal-log-contact",
 "N3": "/x/n3-renewal-not-renewing",
 "N4": "/x/n4-renewal-renewed",
 "NTF": "/notifications",
 "OC1": "/x/oc1-add-product-brochure-reading-failed",
 "P1": "/x/p1-payment-add-payment-link",
 "P3": "/x/p3-payment-recorded",
 "PD1": "/x/pd1-check-document-values",
 "PD2": "/x/pd2-document-versions",
 "PF3": "/x/pf3-edit-family-member",
 "PO1": "/x/po1-policy-record-cancellation",
 "PO2": "/x/po2-policy-cancelled",
 "PO3": "/x/po3-policy-expired",
 "PO4": "/x/po4-policy-renewed",
 "PP1": "/x/pp1-edit-policy-nominees",
 "PP2": "/x/pp2-record-existing-policy",
 "PRC": "/x/prc-proposal-cancel",
 "PRD": "/x/prd-proposal-mark-declined",
 "PRD2": "/x/prd2-proposal-declined",
 "PRL": "/proposals",
 "PV1": "/x/pv1-add-vehicle",
 "PV2": "/x/pv2-vehicle-added",
 "PY1": "/x/py1-payment-mark-failed",
 "PY2": "/x/py2-payment-failed",
 "PY3": "/x/py3-payment-link-expired",
 "PY4": "/x/py4-payment-reverse-undo",
 "PY5": "/x/py5-payment-reversed",
 "Q11": "/x/q11-quotation-generated",
 "Q4": "/x/q4-quotation-insurer",
 "Q5": "/x/q5-quotation-product",
 "QS1": "/x/qs1-quotation-ready-not-shared",
 "QS2": "/x/qs2-quotation-share",
 "QS3": "/x/qs3-quotation-mark-rejected",
 "QS4": "/x/qs4-quotation-rejected",
 "QS5": "/x/qs5-quotation-expired",
 "QS6": "/x/qs6-quotation-cancel",
 "QS7": "/x/qs7-quotation-cancelled",
 "QS8": "/x/qs8-quotation-revise",
 "QS9": "/x/qs9-quotation-delete-draft",
 "QX1": "/x/qx1-public-quotation-link-expired-or-invalid",
 "R5": "/x/r5-proposal-premium",
 "R6": "/x/r6-proposal-review-and-submit",
 "R7": "/x/r7-proposal-submitted",
 "RF1": "/x/rf1-referrer-new-link",
 "RF2": "/x/rf2-referrer-disable",
 "RF3": "/x/rf3-referrer-disabled",
 "RN0": "/x/rn0-renewal-how-to-renew",
 "RNB4": "/x/rnb4-renewal-new-quotation-ready",
 "RS1": "/x/rs1-renewal-in-follow-up",
 "RS2": "/x/rs2-renewal-not-renewing",
 "RS3": "/x/rs3-renewal-reopen",
 "RS4": "/x/rs4-renewal-lapsed",
 "RS5": "/x/rs5-renewal-pause-reminders",
 "RX1": "/x/rx1-referral-link-expired-or-revoked",
 "S03": "/x/s03-settings-kyc",
 "S04": "/x/s04-settings-my-insurers",
 "S05": "/x/s05-settings-whatsapp-wallet",
 "S06": "/x/s06-settings-assistants",
 "S07": "/x/s07-settings-referrers",
 "S08": "/x/s08-settings-support-access",
 "S09": "/x/s09-settings-export-my-data",
 "SA1": "/x/sa1-support-access-give-access",
 "TK1": "/x/tk1-add-task-empty",
 "TK3": "/x/tk3-task-created",
 "TK4": "/x/tk4-edit-task",
 "TK5": "/x/tk5-task-completed",
 "TK6": "/x/tk6-reschedule-task",
 "TSK": "/tasks",
 "VH1": "/x/vh1-vehicle-mark-inactive",
 "WL1": "/x/wl1-wallet-recharge-pending",
 "WL2": "/x/wl2-wallet-recharge-failed",
 "AP3–AP5": "/x/ap3-add-product-product",
 "CQ2–CQ8": "/x/cq2-comparison-type",
 "Q1–Q10": "/x/q1-quotation-customer",
 "R1–R6": "/x/r1-proposal-members"
}
// per-entity overrides where a code is shared by two frames
export const entityLinks = { 'Price version': { PV1: '/x/pv1-product-my-price-versions', PV2: '/x/pv2-product-add-price-version' } }
