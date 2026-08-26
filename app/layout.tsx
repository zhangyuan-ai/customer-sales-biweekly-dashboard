import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });

export const metadata: Metadata = {
  title: '西安望家欢农业科技有限公司｜客户公司销售周/月环比看板',
  description: '按客户公司维度汇总销售额、参考毛利额与毛利率的周度及月度变化。',
  openGraph: {
    title: '西安望家欢农业科技有限公司｜客户公司销售 · 周/月环比看板',
    description: '销售额、参考毛利额与毛利率的周度及月度对比',
    type: 'website',
    images: process.env.SITE_ORIGIN
      ? [{ url: new URL('/og.png', process.env.SITE_ORIGIN).toString(), width: 1731, height: 909, alt: '西安望家欢农业科技有限公司客户公司销售周月环比看板' }]
      : [],
  },
  twitter: {
    card: 'summary_large_image',
    title: '西安望家欢农业科技有限公司｜客户公司销售 · 周/月环比看板',
    description: '销售额、参考毛利额与毛利率的周度及月度对比',
    images: process.env.SITE_ORIGIN ? [new URL('/og.png', process.env.SITE_ORIGIN).toString()] : [],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body className={geistSans.variable}>{children}</body></html>;
}
