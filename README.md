
# dot.screenings4u.com marketing website — v1

Front-facing DOT marketing website created from the production DOT management architecture and live Workforce plan data.

## Key decisions
- Homepage does **not** show generic pricing/payment cards.
- Homepage routes customers to dedicated C/TPA / FMCSA / FAA / FRA / FTA / PHMSA / USCG pages.
- Each dedicated page contains its own plan comparison and monthly pricing.
- Plan selection buttons sit directly under the comparison columns.
- Employer agency pricing: Essential $85, Professional $145, Enterprise $245.
- C/TPA pricing: Essential $125, Professional $225, Enterprise $375.
- Footer contains the screenings4u Family links requested.
- Connected portal links point to the production DOT portal domains.
- Checkout captures only email + selected plan before payment; company/account intake is post-payment.

## Files
- `index.html` — marketing homepage
- `ctpa.html`
- `fmcsa.html`
- `faa.html`
- `fra.html`
- `fta.html`
- `phmsa.html`
- `uscg.html`
- `checkout.html` — short pre-payment handoff scaffold to Workforce checkout backend
- `intake.html` — post-payment company/account intake

## Checkout note
`checkout.html` already calls the live `workforce-checkout` endpoint and creates the checkout intent. The live backend currently returns mounted-checkout metadata (price/product/reference), so the final Stripe payment-element/session mount still needs to be connected on this page before production deployment.
