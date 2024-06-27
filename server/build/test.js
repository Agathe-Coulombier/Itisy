const React = require('react');
const { useState, useEffect, useRef } = require('react');
const logoTab = null //require('./logoTab.png');

const MailTemplate = (props) => {
    return React.createElement('div', {
        id: 'mailTemplate',
        style: {
            margin: 0,
            padding: 0,
            height: '100%',
            top: 0,
            left: 0
        }
    }, 
    React.createElement('header', {
        style: {
            height: '15%',
            padding: '0 10%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'left',
            margin: '10px 0'
        }
    }, 
    React.createElement('img', {
        src: logoTab,
        alt: 'Chef hat logo',
        style: {
            height: '4.4em',
            marginBottom: '2.1em',
            cursor: 'pointer'
        }
    }), 
    React.createElement('h1', {
        className: 'text',
        style: {
            textTransform: 'uppercase',
            fontSize: '3em',
            margin: '0 10px',
            cursor: 'pointer'
        }
    }, 'itisy')),
    
    React.createElement('body', {
        style: {
            height: '50%',
            padding: '20px 25%',
            backgroundColor: 'white',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
        }
    }, 
    React.createElement('h2', {
        className: 'text',
        style: {
            fontSize: '2em'
        }
    }, `Hi ${props.firstName},`),
    React.createElement('img', {
        src: 'https://0ec63ca6b7.imgdist.com/pub/bfra/84ybnnzb/v41/on1/t3f/image_2024-06-27_081531960.png',
        alt: 'Lock',
        style: {
            width: '20%',
            position: 'relative',
            left: '50%',
            transform: 'translateX(-50%)'
        }
    }),
    React.createElement('br'),
    React.createElement('br'),
    React.createElement('p', {
        style: {
            fontSize: '1em'
        }
    }, 'To reset your password, please click this link:'),
    React.createElement('br'),
    React.createElement('a', {
        href: props.url,
        style: {
            fontSize: '1em',
            width: '90%',
            textAlign: 'center',
            position: 'relative',
            left: '50%',
            transform: 'translateX(-50%)'
        }
    }, props.url)
    ),

    React.createElement('footer', {
        style: {
            height: '25%',
            padding: '20px 25%',
            fontSize: '1em',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
        }
    }, 
    React.createElement('p', null, 'Template still in development. Thank you for taking a look at my work,'),
    React.createElement('br'),
    React.createElement('p', null, 'Agathe.')
    )
    );
};

module.exports = MailTemplate;
