document.addEventListener('DOMContentLoaded', function() {
    const pdfViewer = document.getElementById('pdfViewer');
    const pdfUrl = 'http://localhost:3000/proxy?url=paForm.pdf';
    const loadingTask = pdfjsLib.getDocument(pdfUrl);

    loadingTask.promise.then(pdf => {
        return pdf.getPage(1).then(page => {
            return page.getTextContent();
        });
    }).then(textContent => {
        const textItems = textContent.items.map(item => item.str).join('');

        const keywords = ['Medication Prior Authorization Form','First Name','General Information','Patient Information', 'Clinical Documentation', 'Provider Information'];
        const highlightedText = highlightText(textItems, keywords);

        pdfViewer.innerHTML = highlightedText;
    }).catch(error => {
        console.error('Error loading PDF:', error);
    });

    function highlightText(document, keywords) {
        let highlightedDocument = document;
        keywords.forEach(keyword => {
            let regex = new RegExp('\\b' + keyword + '\\b', 'gi');
            highlightedDocument = highlightedDocument.replace(regex, '<span class="highlighted">' + keyword + '</span>');
        });
        return highlightedDocument;
    }
});