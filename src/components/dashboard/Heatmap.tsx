import { cn } from '@/lib/utils'

const DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const BRANCHES_HEAT = [
  { name: 'Байтерекова', data: [8, 10, 12, 9, 11, 14, 7] },
  { name: 'Аптека №17', data: [5, 7, 6, 9, 8, 10, 4] },
  { name: 'Аптека №9', data: [4, 5, 7, 6, 8, 5, 3] },
  { name: 'Аптека №12', data: [2, 3, 4, 3, 5, 3, 2] },
  { name: 'Аптека №2', data: [3, 2, 4, 2, 3, 4, 2] },
  { name: 'Аст. Анет баба', data: [1, 2, 1, 3, 2, 1, 1] },
  { name: 'Мамыр-2', data: [0, 0, 1, 0, 0, 1, 0] },
]

function getHeatColor(v: number): string {
  if (v === 0) return 'bg-green-50 text-green-800'
  if (v <= 2) return 'bg-green-100 text-green-800'
  if (v <= 5) return 'bg-amber-100 text-amber-800'
  if (v <= 8) return 'bg-orange-200 text-orange-900'
  if (v <= 11) return 'bg-red-400 text-white'
  return 'bg-red-700 text-white'
}

export default function Heatmap() {
  return (
    <div className="card p-4">
      <div className="text-xs uppercase tracking-wider text-gray-400 font-medium mb-3">
        Тепловая карта жалоб (последние 7 дней)
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-[11px]">
          <thead>
            <tr>
              <th className="text-left text-gray-400 font-normal pb-2 pr-3 w-28">Филиал</th>
              {DAYS.map((d) => (
                <th key={d} className="text-center text-gray-400 font-normal pb-2 w-10">{d}</th>
              ))}
            </tr>
          </thead>
          <tbody className="space-y-1">
            {BRANCHES_HEAT.map((branch) => (
              <tr key={branch.name}>
                <td className="pr-3 py-1 text-gray-600 text-[11px] whitespace-nowrap">{branch.name}</td>
                {branch.data.map((v, i) => (
                  <td key={i} className="py-0.5 px-0.5 text-center">
                    <div className={cn('h-7 w-9 rounded flex items-center justify-center font-medium mx-auto', getHeatColor(v))}>
                      {v}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-2 mt-3">
        <span className="text-[10px] text-gray-400">Жалоб:</span>
        {[
          { label: '0', cls: 'bg-green-50' },
          { label: '1–2', cls: 'bg-green-100' },
          { label: '3–5', cls: 'bg-amber-100' },
          { label: '6–8', cls: 'bg-orange-200' },
          { label: '9–11', cls: 'bg-red-400' },
          { label: '12+', cls: 'bg-red-700' },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1">
            <div className={cn('w-3 h-3 rounded', item.cls)} />
            <span className="text-[10px] text-gray-400">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
