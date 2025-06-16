import Link from "next/link"

export default function LegalHeader() {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-6 py-4">
        <Link href="/" className="text-2xl font-bold" style={{ color: '#0e6537', textDecoration: 'none' }}>
          ACS
        </Link>
      </div>
    </div>
  )
} 