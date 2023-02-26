import express from "express";

export default function urlencodedMiddleware() {
  return express.urlencoded({ extended: false });
}