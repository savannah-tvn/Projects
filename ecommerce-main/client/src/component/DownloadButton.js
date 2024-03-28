import React from 'react';

class DownloadButton extends React.Component {
  handleClick = () => {
    const link = document.createElement('a');
    link.href = 'http://localhost:8000/storage/fiche_technique.pdf';
    link.download = 'fiche_technique.pdf';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  render() {
    return (
      <button onClick={this.handleClick}>Fiche Technique</button>
    );
  }
}

export default DownloadButton;