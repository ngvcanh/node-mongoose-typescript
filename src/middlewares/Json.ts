import express from "express";

export default function JsonMiddleware() {
  return express.json();
}