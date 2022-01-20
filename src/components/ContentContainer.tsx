import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import "../css/MainContent.css";
import MainContent from "./MainContent";
const electron = window.require("electron");

export default function ContentContainer() {
  return (
    <div>
      <MainContent />
    </div>
  );
}
