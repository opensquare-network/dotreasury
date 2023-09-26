# Changelog

Notable changes to this project will be documented in this file, started from 4.0.0

### 4.0.0

- [Big] Add a landing page where we aggregate several projects' treasury data in the ecosystem.
- Creat a graphql server to host data for landing page.
- [Big] Refactor server and front site code for single chain deployment. It will be easy for scale, and projects can be deployed under sub-domains, like kusama.dotreasury.com.
- Fix subscription message pushing to avoid to many data updates.
- Fix treasury participants api and we can sort beneficiaries by total fiat awarded.
- Add sub.id to funded projects.
