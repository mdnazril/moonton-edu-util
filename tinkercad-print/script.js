$(function() {

    var form = $('#form');
    var print = $('#print');
    var pageTemplate = $('.page').first().clone();
    $('.page').remove();

    form.on("submit", function(e) {
        e.preventDefault();
        print.empty();

        var htmlInput = $('#inputHTML').val();
        if (!htmlInput) {
            console.error("No HTML content provided.");
            return;
        }

        var parser = new DOMParser();
        var doc = parser.parseFromString(htmlInput, 'text/html');

        const className = doc.querySelector('#classNameDetailTitle p').innerText;

        const aTagsWithTkImage = Array.from(
            doc.querySelectorAll('a:has(tk-turntable-image)')
        );

        const names = Array.from(
            doc.querySelectorAll('.thing-box-edit-with-information-wrapper h3 a')
        );

        const minLength = Math.min(aTagsWithTkImage.length, names.length);
        let outputData = [];

        for (let i = 0; i < minLength; i++) {
            outputData.push({
                id: aTagsWithTkImage[i].href,
                name: names[i].innerText
            });
        }

        let baseUrl = "https://csg.tinkercad.com/things/{idHere}/t725.png?rev=1730722667986000000&s=&v=1";

        function extractId(url) {

            let extractedId = '';

            const match = url.match(/\/things\/([^-]+)/);

            if (match) {
                extractedId = match[1];
            }

            return extractedId;
        }

        outputData.forEach(function(entry) {
            var newPage = pageTemplate.clone();
            newPage.find('.title').text(entry.name);

            let extractedId = extractId(entry.id);
            let imageUrl = baseUrl.replace("{idHere}", extractedId);
            newPage.find('.photo').attr('src', imageUrl || '/assets/placeholder.png');

            newPage.show();
            print.append(newPage);
        });

    });

    function printPage() {
        let pagesContent = '';
        $('.page').each(function() {
            pagesContent += this.outerHTML;
        });

        let printWindow = window;
        document.title = "Print Pages";

        printWindow.document.open();
        printWindow.document.write(`
<html>
<head>
    <title>Print Pages</title>
    <style>
        @media print {
            .page {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-between;
                margin: 20px auto;
                padding: 5mm 0 0 0;
                page-break-after: always;
                width: 210mm;
                height: 297mm;
                verflow: hidden;
            }
        }

        body {
            font-family: Arial, sans-serif;
            text-align: center;
        }

        .title {
            font-size: 2rem;
            font-weight: 700;
        }

        .header img {
            width: 300px;
        }

        .content {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1.5rem;
        }

        .title {
            font-size: 2rem;
            font-weight: 700;
        }

        .footer img {
            width: 100%;
        }
    </style>
</head>

<body>
    ${pagesContent}
</body>

</html>
        `);
        printWindow.document.close();

        printWindow.print();
    }

    $('#printButton').on('click', printPage);

});