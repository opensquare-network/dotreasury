# Changelog

Notable changes to this project will be documented in this file, started from 4.0.0

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
