# Changelog

Notable changes to this project will be documented in this file, started from 4.0.0

# 4.3.3

Date: 2025-01-20

- Handle child bounties whole lifecycle in one block.
- Update centrifuge treasury loan to $1.5M.

# 4.3.2

Date: 2024-12-31

- Add ambassador section to the polkadot treasury.
- Fix value display to show 1M instead of 1,000K.
- Enable new application page for kusama.
- User eco data API to get DOT price.

# 4.3.1

Date: 2024-12-20

- Support astar on landing page.
- Update phala endpoints

# 4.3.0

Date: 2024-12-03

- Refactor polkadot home page and show multi-chain, multi-assets treasury.
- Fix eco data API to fix polkadot treasury balance on landing page.
- Use subsquare API for polkadot treasury applications page.
- Fix scan scripts for bounties.
- Update dependencies.

# 4.2.1

Date: 2024-07-04

- Update identity view for para chain address.
- Upgrade dependencies.
- Fix tips count on home page summary panel.
- Show treasury assets on polkadot assethub.

# 4.2.0

Date: 2024-06-18

- Add chart on home page to show treasury fiat value trend.
- Handle treasury output by transfer without an extrinsic.
- Add statescan external link and remove polkascan external link.
- Add scripts to append missed polkadot/kusama out transfers from treasury.
- Add script to update treasury output statistics.
- Add script to mark tips removed due to pallet removal and support tip removed status.
- Sync treasury proposal title from subsquare.
- Update dependencies and fix styles.

# 4.1.4

Date: 2024-05-11

- Add cron job to update token prices.
- Improve price tickers by introducing more exchanges API and fetching multiple paris one time.
- Update dependencies.
- Add a new tab to show treasury proposals which are failed to deliver.
- Fix styles.

### 4.1.3

Date: 2024-04-16

- scan: support treasury spend by scheduler.
- scan: support `spend_local` method.
- scan: support new refactored preimage pallet.
- scan: fix referenda enactment info extraction.
- scan: fix centrifuge block rewards. They changed the code.
- Fix landing page scroll bar on beneficiary section.
- Support darwinia and integritee on landing page.
- Refactor price ticker script.
- Fix styles.

### 4.1.2

Date: 2023-12-10

- Add acala/karura/bifrost to landing page.
- Fix centrifuge block rewards check.
- Upgrade dependencies.

### 4.1.1

Date: 2023-11-08

- Improve user link on users page.
- Update funded project proposals.
- Add statescan link on user detail page.

### 4.1.0

Date: 2023-10-25

- [Big] Support centrifuge.
- Fix list pages query params not work.
- Fix the key warnings about chart tooltip components.
- Improve income and output period charts Y axis label.

### 4.0.3

Date: 2023-10-20

- Calculate treasury income by spend periods.
- Fix councilor heatmap tooltip position.
- Upgrade dependencies.

### 4.0.2

Date: 2023-10-13

- Support moonbeam/moonriver on landing page.

### 4.0.1

Date: 2023-10-11

- Add top beneficiaries table on home page.
- Scan income statistics by spend periods.
- Fix and refactor test cases.

### 4.0.0

- [Big] Add a landing page where we aggregate several projects' treasury data in the ecosystem.
- Creat a graphql server to host data for landing page.
- [Big] Refactor server and front site code for single chain deployment. It will be easy for scale, and projects can be
  deployed under sub-domains, like kusama.dotreasury.com.
- Fix subscription message pushing to avoid to many data updates.
- Fix treasury participants api and we can sort beneficiaries by total fiat awarded.
- Add sub.id to funded projects.
