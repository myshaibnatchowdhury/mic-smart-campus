# MIC SMART CAMPUS — SECURITY ARCHITECTURE & AUDIT REPORT

## 1. Zero-Trust Multi-Tenant Isolation
MIC Smart Campus enforces complete cryptographic and database-level isolation between independent educational institutions.

### Security Principles:
1. **Database-Level RLS (Kernel Enforcement)**: Tenant isolation does not rely on frontend filtering. PostgreSQL evaluates `institution_id IN (SELECT get_user_institution_ids(auth.uid()))` for every row read or mutation.
2. **Default-Deny Access Control**: Tables deny all access by default unless an explicit policy evaluates to `TRUE`.
3. **No Service-Role Key in Public Clients**: The Supabase `service_role` key is strictly prohibited from browser bundles, Flutter assets, or public environment variables.
4. **Immutable Audit Trails**: Triggers intercept modifications to `students`, `marks`, `student_invoices`, and `institutions`, recording `OLD` and `NEW` JSON snapshots with actor user ID and timestamps into `public.audit_logs`.

---

## 2. Server-Driven UI (SDUI) Security Boundary
The Flutter mobile application renders its dynamic UI via an **Allowlisted Component Registry**. 

- Server configurations CANNOT execute arbitrary Dart, JavaScript, or native code.
- Server configurations CANNOT bypass authentication or inject unvalidated webviews.
- Malformed payloads trigger safe local UI fallbacks without application crashes.

---

## 3. Storage Security & Document Privacy
- Academic transcripts, report cards, and identity documents are stored in **Private Buckets**.
- Access is gated through signed URLs generated strictly for authenticated users belonging to the student's institutional membership.
