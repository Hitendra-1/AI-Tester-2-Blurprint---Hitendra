# Enterprise Test Plan: VWO Login Application

## 1. Test Plan Identifier
VWO-LP-ETP-001

## 2. Introduction
This document outlines the comprehensive test plan for the VWO Login application located at `https://app.vwo.com/#/login`. The goal is to ensure high reliability, security, and professional user experience for the authentication gateway of the VWO platform.

## 3. Test Objectives
- To verify that registered users can successfully authenticate using valid credentials.
- To ensure robust error handling for invalid or unauthorized access attempts.
- To validate the integrity of third-party authentication integrations (Google, SSO, Passkey).
- To confirm that all UI elements, links, and forms function according to industry standards.

## 4. Scope of Testing
### In-Scope
- User Authentication (Email/Password).
- Social Authentication (Sign in with Google).
- Enterprise Authentication (Sign in using SSO).
- Passwordless Authentication (Sign in with Passkey).
- Form Validation (Empty fields, incorrect formats).
- Session Management (Remember me).
- Password Recovery (Forgot Password? link).
- Legal/Compliance links (Privacy Policy, Terms).
- Account Creation redirection (Start a FREE TRIAL).

### Out-of-Scope
- Post-login dashboard functionality.
- Multi-Factor Authentication (MFA) internal logic (unless triggered by login).
- Backend database performance testing.

## 5. Features to be Tested
- **Login Form**: Email input, Password input (with visibility toggle).
- **Primary Action**: "Sign in" button.
- **Secondary Actions**: "Sign in with Google", "Sign in using SSO", "Sign in with Passkey".
- **Helper Links**: "Forgot Password?", "Start a FREE TRIAL".
- **UI State**: "Remember me" checkbox persistence.
- **Legal**: Privacy Policy and Terms of Use links and content.

## 6. Features Not to be Tested
- Any features behind the authenticated session (App settings, Testing tools).
- API-level testing without UI interaction.

## 7. Test Strategy
- **Functional Testing**: Valid and invalid credential testing using Black Box techniques.
- **UI/UX Testing**: Verification of alignment, font consistency, and responsive behavior.
- **Integration Testing**: Verification of redirection to Google/SSO providers.
- **Security Testing**: Verification of masking for the password field and visibility toggle.
- **Validation Testing**: Triggering error messages for empty or malformed inputs.

## 8. Test Environment
- **Browsers**: Google Chrome (Latest), Mozilla Firefox (Latest), Microsoft Edge, Safari.
- **Operating Systems**: Windows 10/11, macOS.
- **Device Types**: Desktop/Laptop.

## 9. Test Data Requirements
- Valid user email and password.
- Invalid user email (non-existent).
- Incorrect password for a valid email.
- Malformed email address formats.
- SSO-enabled enterprise credentials.
- Google account for OAuth testing.

## 10. Entry Criteria
- The VWO Login page is successfully deployed and accessible at `https://app.vwo.com/#/login`.
- Test environments (Browsers/OS) are ready.
- Test data (Valid/Invalid accounts) is provisioned.

## 11. Exit Criteria
- 100% of planned test cases have been executed.
- All 'Critical' and 'Major' category bugs are resolved and verified.
- The "Sign in with Google" and SSO redirects are functional.
- Documentation for test results is finalized.

## 12. Test Deliverables
- Enterprise Test Plan (This document).
- Detailed Test Case Suite.
- Bug Reports (if applicable).
- Test Summary Report.

## 13. Risk and Mitigation
- **Risk**: Social/SSO provider downtime during testing.
  - **Mitigation**: Use mock responses or schedule testing during known stability windows.
- **Risk**: UI changes during the testing phase.
  - **Mitigation**: Continuous coordination with the development team.

## 14. Roles and Responsibilities
- **QA Architect**: Test Plan design and strategy.
- **QA Engineer**: Test execution, bug reporting, and evidence capture.
- **Product Manager**: Requirement clarification and sign-off.

## 15. Test Schedule
| Activity | Duration | Deliverable |
| :--- | :--- | :--- |
| Test Planning | 1 Day | Approved Test Plan |
| Test Case Design | 2 Days | Test Case Suite |
| Test Execution | 3 Days | Executed Results |
| Reporting | 1 Day | Final Summary Report |

---
*Note: Information not explicitly found in visual inspection was supplemented by standard enterprise QA practices for login gateways.*
