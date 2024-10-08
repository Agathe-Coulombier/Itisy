export const itisy = `
@media print {
    body {
        position:relative;
        background-color: darkgrey;
        font-family: Arial, sans-serif;
        -webkit-print-color-adjust: exact;
        width: 210mm; 
        height: 297mm; 
        margin: 0;
        padding: 0mm; 
        box-sizing: border-box;
    }

    .recipe-content {
        height:100%;
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    /* Left Column */
    .recipe-left {
        padding: 20px;
        display: flex;
        align-items: center;
        flex-direction: column;
        flex-grow:0;
    }

    /* Right Column */
    .recipe-right {
        background-color: #ffffff;
        padding: 20px;
        display:flex;
        gap:1cm;
        align-items: start;
        justify-content:start;
        flex-direction: row;
        flex-grow:1;
    }

    /* Title styling */
    .recipe-title {
        font-size: 2.5rem;
        margin-top: 1.2cm;
        margin-bottom : 1cm;
        font-weight: bold;
        color: #5A3823;
        text-align: center;
        text-transform: uppercase;
    }

    /* Meta info like servings and cooking times */
    .recipe-meta {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: calc(100% - 60px);
        font-size: 16pt;
        color: #5A3823;
        border-top : 3px solid #5A3823;
    }

    .recipe-meta .meta-item {
        display: flex;
        align-items: center;
        margin: 20px 0;
        gap:10px;
    }

    /* Image styling */
    .recipe-image-container {
        display: flex;
        width:100%;
        height:6cm;
        justify-content: center;
        align-items: center;
    }

    .recipe-image {
        width:100%;
        height: 100%;
        border-radius: 30px;
        object-fit:cover;
        background-size: cover;
        background-position: center; 
        background-repeat: no-repeat;
    }



    /* Ingredients and steps styling */
    .recipe-ingredients, .recipe-steps {
        margin-top: 20px;
    }

    .recipe-ingredients{
        flex:4
    }

    .recipe-steps{
        flex:6
    }

    .recipe-ingredients h2, .recipe-steps h2 {
        font-size: 1.8rem;
        color: #5A3823;
        margin-bottom: 15px;
        text-transform: uppercase;
        font-weight: bold;
    }

    .recipe-ingredients ul, .recipe-steps ol {
        margin-top: 10px;
        padding-left: 20px;
        font-size: 1.2rem;
        line-height: 1.5;
    }

    .recipe-ingredients li, .recipe-steps li {
        margin-bottom: 10px;
    }

    .recipe-source{
        /* color:#e4d9c9; */
        width:100%;
        padding:0;
        margin:0;
        font-size: 10pt;
        position:absolute;
        bottom:0;
    }

    .no-print {
        display: none;
    }
}

`;
