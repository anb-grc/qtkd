/**
 * Chuyển đổi một chuỗi thành định dạng slug (không dấu, chữ thường, gạch nối).
 * Dùng để đối chiếu các tag bất chấp lỗi chính tả cơ bản, khoảng trắng hay hoa/thường.
 */
export function slugify(text: string): string {
  if (!text) return '';
  
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD') // Tách dấu ra khỏi ký tự (Ví dụ: "ế" -> "e" + "̂" + "́")
    .replace(/[\u0300-\u036f]/g, '') // Xóa các dấu
    .replace(/đ/g, 'd') // Thay chữ đ thành d
    .trim() // Xóa khoảng trắng 2 đầu
    .replace(/\s+/g, '-') // Thay khoảng trắng bằng gạch nối
    .replace(/[^\w-]+/g, '') // Xóa các ký tự đặc biệt (chỉ giữ lại chữ cái, số và gạch nối)
    .replace(/--+/g, '-'); // Gộp nhiều gạch nối thành 1
}
