export function mask(data: string, maskType: 'phone' | 'id' | 'tax'): string {
  if (!data) return '';
  let masked = data;
  switch (maskType) {
    case 'phone':
      // สมมติหมายเลขโทรศัพท์มีรูปแบบเป็น 10 หลัก เช่น 0812345678
      if (data.length === 10) {
        masked = data.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
      }
      break;
    case 'id':
      // สมมติหมายเลขบัตรประชาชนมีรูปแบบเป็น 13 หลัก เช่น 1234567890123
      if (data.length === 13) {
        masked = data.replace(
          /(\d{1})(\d{4})(\d{5})(\d{2})(\d{1})/,
          '$1-$2-$3-$4-$5'
        );
      }
      break;
    case 'tax':
      // สมมติหมายเลขประจำตัวผู้เสียภาษีมีรูปแบบเป็น 13 หลัก เช่น 1234567890123
      if (data.length === 13) {
        masked = data.replace(
          /(\d{3})(\d{2})(\d{5})(\d{2})(\d{1})/,
          '$1-$2-$3-$4-$5'
        );
      }
      break;
  }
  return masked;
}
