import "@testing-library/jest-dom";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    pathname: "/",
  }),
}));

// Mock window.location before tests
// @ts-expect-error - mocking window.location
delete window.location;
window.location = {
  href: "http://localhost/",
  search: "",
  hash: "",
  pathname: "/",
} as Location;
