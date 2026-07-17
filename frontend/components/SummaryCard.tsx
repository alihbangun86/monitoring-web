interface Props {
  title: string;
  value: string;
}

export default function SummaryCard({ title, value }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
      <p className="text-sm font-medium text-gray-500">{title}</p>

      <h2 className="mt-3 text-4xl font-bold text-gray-900">
        {value}
      </h2>
    </div>
  );
}