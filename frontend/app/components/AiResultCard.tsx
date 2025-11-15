export default function AiResultCard({ content, emotion }: { content: string; emotion: string }) {
  return (
    <div className="p-6 bg-white rounded-xl shadow border border-gray-200">
      <p className="text-lg font-medium mb-2">📝 {content}</p>
      <p className="text-xl">
        감정: <strong className="text-purple-600">{emotion}</strong>
      </p>
    </div>
  );
}
