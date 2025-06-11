'use client';

const GradientText = ({ 
    text, 
    isPending, 
    messageType 
}: { 
    text: string, 
    isPending: boolean, 
    messageType?: string 
}) => {
    if (!text) return null;

    const singleLineText = text.replace(/\n/g, ' ');
    const prefix = messageType === 'inbound-email' ? 'Lead: ' : 'You: ';
    const limitedText = (prefix + singleLineText).slice(0, 95) + '...';

    return (
        <span
            className="text-sm text-gray-500 block"
            style={{
                WebkitMaskImage: 'linear-gradient(90deg, black 0%, black 80%, transparent 100%)',
                maskImage: 'linear-gradient(90deg, black 0%, black 80%, transparent 100%)',
                maxWidth: '100%',
                overflow: 'hidden',
                display: 'block',
            }}
        >
            {limitedText}
        </span>
    );
};

export default GradientText; 