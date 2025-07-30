import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Header from "../Header";

// Mock the onClickOutside hook
jest.mock("../../hooks/onClickOutside", () => jest.fn());

describe("Header Component", () => {
  const renderHeader = () => {
    return render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
  };

  test("renders logo and navigation links", () => {
    renderHeader();

    // Check if logo is present
    const logo = screen.getByAltText("Logo");
    expect(logo).toBeInTheDocument();

    // Check navigation links
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Vice President")).toBeInTheDocument();
    expect(screen.getByText("Sponsors")).toBeInTheDocument();
    expect(screen.getByText("Teams")).toBeInTheDocument();
    expect(screen.getByText("Competition")).toBeInTheDocument();
    expect(screen.getByText("Application")).toBeInTheDocument();
  });

  test("toggles mobile menu when menu button is clicked", () => {
    renderHeader();

    // Initial state - menu is closed
    const navElement = screen.getByRole("navigation");
    expect(navElement).not.toHaveClass("open");

    // Click menu button
    const menuButton = screen.getByRole("button");
    fireEvent.click(menuButton);

    // Menu should be open
    expect(navElement).toHaveClass("open");
  });
});
