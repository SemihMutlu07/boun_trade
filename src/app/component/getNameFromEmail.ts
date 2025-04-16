export default function getNameFromEmail(email: string) {
    if (!email || !email.includes('@')) return 'Unknown'
  
    const username = email.split('@')[0]
    const words = username.split('.')
  
    return words
      .map(word =>
        word
          .toLowerCase()
          .replace(/^\w/, c => c.toUpperCase())
      )
      .join(' ')
  }
  