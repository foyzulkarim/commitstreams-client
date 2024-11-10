import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

function TextHighlight({ text, searchKeyword }) {
  const [highlightedText, setHighlightedText] = useState(text);

  useEffect(() => {
    if (searchKeyword) {
      const regex = new RegExp(`(${searchKeyword})`, 'gi');
      const parts = text?.split(regex) ?? [];
      const newHighlightedText = parts.map((part, i) =>
        part.toLowerCase() === searchKeyword.toLowerCase() ? (
          <mark key={i}>{part}</mark>
        ) : (
          part
        )
      );
      setHighlightedText(newHighlightedText);
    } else {
      setHighlightedText(text); // Reset to original text
    }
  }, [text, searchKeyword]);

  return (
    <Stack direction="row" spacing={1}>
      <Typography variant="subtitle2">
        {highlightedText}
      </Typography>
    </Stack>
  );
}

TextHighlight.propTypes = {
  text: PropTypes.string.isRequired,
  searchKeyword: PropTypes.string,
}

export default TextHighlight;
