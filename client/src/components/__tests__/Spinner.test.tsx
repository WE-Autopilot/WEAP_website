import React from "react";
import { render, screen } from "@testing-library/react";
import { Spinner } from "../common";

describe("Spinner Component", () => {
  test("renders without crashing", () => {
    render(<Spinner />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("displays label when provided", () => {
    const label = "Loading data...";
    render(<Spinner label={label} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  test("applies correct size class", () => {
    const { container } = render(<Spinner size="large" />);
    const spinnerElement = container.querySelector(".spinner-large");
    expect(spinnerElement).toBeInTheDocument();
  });

  test("applies correct color class", () => {
    const { container } = render(<Spinner color="secondary" />);
    const spinnerElement = container.querySelector(".spinner-secondary");
    expect(spinnerElement).toBeInTheDocument();
  });

  test("applies fullPage class when fullPage is true", () => {
    const { container } = render(<Spinner fullPage />);
    const fullPageElement = container.querySelector(".spinner-fullpage");
    expect(fullPageElement).toBeInTheDocument();
  });
});
