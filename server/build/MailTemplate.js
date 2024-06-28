const React = require('react');
const { useState, useEffect, useRef } = require('react');
const logoTab = null //require('./logoTab.png');
// import "./MailTemplate.css";
const _jsx = require("react/jsx-runtime").jsx;
const _jsxs = require("react/jsx-runtime").jsxs;

const MailTemplate = props => {
  return /*#__PURE__*/_jsxs("div", {
    id: "mailTemplate",
    style: {
      margin: 0,
      padding: 0,
      height: "100%",
      top: 0,
      left: 0
    },
    children: [/*#__PURE__*/_jsxs("header", {
      style: {
        "height": "15%",
        "padding": "0 10%",
        "display": "flex",
        "alignItems": "center",
        "justifyContent": "left",
        "margin": "10px 0"
      },
      children: [/*#__PURE__*/_jsx("img", {
        src: logoTab,
        alt: "Chef hat logo",
        style: {
          "height": "4.4em",
          "marginBottom": "2.1em",
          "cursor": "pointer"
        }
      }), /*#__PURE__*/_jsx("h1", {
        className: "text",
        style: {
          "textTransform": "uppercase",
          "fontSize": "3em",
          "margin": "0 10px",
          "cursor": "pointer"
        },
        children: "itisy"
      })]
    }), /*#__PURE__*/_jsxs("body", {
      style: {
        "height": "50%",
        "padding": "20px 25%",
        "backgroundColor": "white",
        "display": "flex",
        "flexDirection": "column",
        "justifyContent": "center"
      },
      children: [/*#__PURE__*/_jsxs("h2", {
        className: "text",
        style: {
          "fontSize": "2em"
        },
        children: ["Hi ", props.firstName, ","]
      }), /*#__PURE__*/_jsx("img", {
        src: "https://0ec63ca6b7.imgdist.com/pub/bfra/84ybnnzb/v41/on1/t3f/image_2024-06-27_081531960.png",
        alt: "Lock",
        style: {
          "width": "20%",
          "position": "relative",
          "left": "50%",
          "transform": "translateX(-50%)"
        }
      }), /*#__PURE__*/_jsx("br", {}), /*#__PURE__*/_jsx("br", {}), /*#__PURE__*/_jsx("p", {
        style: {
          "fontSize": "1em"
        },
        children: "To reset your password, please click this link:"
      }), /*#__PURE__*/_jsx("br", {}), /*#__PURE__*/_jsx("a", {
        href: props.url,
        style: {
          "fontSize": "1em",
          "width": "90%",
          "textAlign": "center",
          "position": "relative",
          "left": "50%",
          "transform": "translateX(-50%)"
        },
        children: props.url
      })]
    }), /*#__PURE__*/_jsxs("footer", {
      style: {
        "height": "25%",
        "padding": "20px 25%",
        "fontSize": "1em",
        "display": "flex",
        "flexDirection": "column",
        "justifyContent": "center"
      },
      children: [/*#__PURE__*/_jsx("p", {
        children: "Template still in development. Thank you for taking a look at my work,"
      }), /*#__PURE__*/_jsx("br", {}), /*#__PURE__*/_jsx("p", {
        children: "Agathe."
      })]
    })]
  });
};
module.exports = MailTemplate;