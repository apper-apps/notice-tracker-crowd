# Notice Sender Iframe Embedding Instructions

## Basic Embedding

To embed the Notice Sender widget in your website, add the following HTML:

```html
<iframe 
  src="https://your-domain.com/iframe.html" 
  width="100%" 
  height="600"
  frameborder="0"
  scrolling="auto"
  style="border: 1px solid #e2e8f0; border-radius: 8px;">
</iframe>
```

## Responsive Embedding

For responsive behavior, use this CSS:

```css
.notice-sender-iframe {
  width: 100%;
  min-height: 600px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
}

@media (max-width: 768px) {
  .notice-sender-iframe {
    min-height: 500px;
  }
}
```

## JavaScript Integration

Listen for events from the iframe:

```javascript
window.addEventListener('message', function(event) {
  if (event.origin !== 'https://your-domain.com') return;
  
  switch(event.data.type) {
    case 'IFRAME_READY':
      console.log('Notice sender widget loaded');
      break;
      
    case 'NOTICE_SENT_SUCCESS':
      console.log('Notice sent successfully:', event.data.payload);
      // Handle success - show confirmation, redirect, etc.
      break;
      
    case 'NOTICE_SENT_ERROR':
      console.error('Failed to send notice:', event.data.payload);
      // Handle error - show error message, retry option, etc.
      break;
      
    case 'RESIZE_IFRAME':
      // Auto-resize the iframe
      const iframe = document.getElementById('notice-sender-iframe');
      if (iframe) {
        iframe.style.height = event.data.height + 'px';
      }
      break;
  }
});
```

## Auto-Resize Implementation

For automatic height adjustment:

```html
<iframe 
  id="notice-sender-iframe"
  src="https://your-domain.com/iframe.html" 
  width="100%" 
  height="600"
  frameborder="0"
  scrolling="no"
  style="border: 1px solid #e2e8f0; border-radius: 8px;">
</iframe>

<script>
window.addEventListener('message', function(event) {
  if (event.data.type === 'RESIZE_IFRAME') {
    const iframe = document.getElementById('notice-sender-iframe');
    if (iframe) {
      iframe.style.height = event.data.height + 'px';
    }
  }
});
</script>
```

## Security Considerations

- Always validate the origin of postMessage events
- Use HTTPS for production deployments
- Consider implementing CSP headers for additional security
- Test cross-origin functionality thoroughly

## Customization Options

The iframe automatically detects its embedded context and:
- Removes header navigation elements
- Adjusts padding and spacing for embedded use
- Provides appropriate responsive behavior
- Maintains full functionality while optimizing for iframe constraints

## Build Instructions

To build the iframe version:

1. Run `npm run build` to create the production build
2. The `iframe.html` file will be generated in the dist folder
3. Deploy both the main application and iframe.html
4. Update the iframe src URL to point to your deployed iframe.html

## Testing

Test the iframe embedding by:
1. Creating a test HTML page with the iframe code
2. Verifying all functionality works within the iframe
3. Testing responsive behavior at different screen sizes
4. Confirming postMessage communication works correctly
5. Validating cross-origin policies are properly configured