export const mrgap = (gap) => (
  `
    & > :not(:first-child):not(:last-child) {
      margin-left: calc(${gap} / 2);
      margin-right: calc(${gap} / 2);
    }
    & > :first-child {
      margin-right: calc(${gap} / 2);
    }
    & > :last-child {
      margin-left: calc(${gap} / 2);
    }
  `
)
