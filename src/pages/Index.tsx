import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [clientData, setClientData] = useState({
    date: '',
    clientNumber: '',
    clientName: '',
    carModel: '',
    carYear: '',
    carPrice: 0,
    creditLimit: 0
  });

  const [sovcomData, setSovcomData] = useState({
    carPrice: 0,
    monthlyPayment: 0,
    totalCredit: 0
  });

  const [vtbData, setVtbData] = useState({
    creditLimit: 0,
    monthlyPayment: 0,
    totalCredit: 0
  });

  // Автоматический расчет для Совкомбанка
  const calculateSovcom = (price: number) => {
    const lifeInsurance = 301250;
    const kasko = 473250;
    const helpCard = 287450;
    const totalCredit = price + lifeInsurance + kasko + helpCard;
    
    setSovcomData({
      carPrice: price,
      totalCredit: totalCredit,
      monthlyPayment: 0 // пользователь вводит вручную
    });
  };

  // Автоматический расчет для ВТБ
  const calculateVTB = (limit: number) => {
    const lifeInsurance = 62250;
    const totalCredit = limit + lifeInsurance;
    
    setVtbData({
      creditLimit: limit,
      totalCredit: totalCredit,
      monthlyPayment: 0 // пользователь вводит вручную
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Icon name="Building2" size={32} className="text-primary" />
              <h1 className="text-2xl font-bold text-slate-900">RIA-AVTO</h1>
              <Badge variant="secondary" className="text-xs">CRM СИСТЕМА</Badge>
            </div>
            <div className="text-sm text-slate-600">
              Бланк № А/С 8525-25
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Клиентские данные */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Icon name="User" size={20} />
              <span>База данных клиентов</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="date">Дата</Label>
                <Input
                  id="date"
                  type="date"
                  value={clientData.date}
                  onChange={(e) => setClientData({...clientData, date: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="clientNumber">Номер клиента</Label>
                <Input
                  id="clientNumber"
                  placeholder="А/С 8525-25"
                  value={clientData.clientNumber}
                  onChange={(e) => setClientData({...clientData, clientNumber: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="clientName">ФИО клиента</Label>
                <Input
                  id="clientName"
                  placeholder="Введите ФИО"
                  value={clientData.clientName}
                  onChange={(e) => setClientData({...clientData, clientName: e.target.value})}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="programs" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="programs">Программы банков</TabsTrigger>
            <TabsTrigger value="calculator">Кредитный калькулятор</TabsTrigger>
            <TabsTrigger value="comparison">Сравнение</TabsTrigger>
            <TabsTrigger value="dealer">Дилерские авто</TabsTrigger>
          </TabsList>

          {/* Банковские программы */}
          <TabsContent value="programs" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Совкомбанк */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Icon name="Building" size={20} />
                      <span>Business Finance</span>
                    </div>
                    <Badge className="bg-primary">Совкомбанк</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-sm text-slate-600 mb-2">Реализация банковских Б/У автомобилей</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Процентная ставка:</span>
                        <span className="font-semibold">10,25%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Срок кредита:</span>
                        <span className="font-semibold">60 месяцев</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Первоначальный взнос:</span>
                        <span className="font-semibold">0,00 руб</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="sovcom-car">Автомобиль и год</Label>
                    <Input
                      id="sovcom-car"
                      placeholder="Модель и год автомобиля"
                      value={clientData.carModel}
                      onChange={(e) => setClientData({...clientData, carModel: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="sovcom-price">Стоимость автомобиля (руб)</Label>
                    <Input
                      id="sovcom-price"
                      type="number"
                      placeholder="0"
                      value={clientData.carPrice || ''}
                      onChange={(e) => {
                        const price = Number(e.target.value);
                        setClientData({...clientData, carPrice: price});
                        calculateSovcom(price);
                      }}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Обязательные страховые продукты:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Страхование жизни (5 лет):</span>
                        <span className="font-medium">301 250 руб</span>
                      </div>
                      <div className="flex justify-between">
                        <span>КАСКО (5 лет):</span>
                        <span className="font-medium">473 250 руб</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Карта помощи РАТ (5 лет):</span>
                        <span className="font-medium">287 450 руб</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-semibold">Сумма кредита:</span>
                      <span className="font-bold text-lg">{sovcomData.totalCredit.toLocaleString()} руб</span>
                    </div>
                    <div>
                      <Label htmlFor="sovcom-payment">Ежемесячный платеж (руб)</Label>
                      <Input
                        id="sovcom-payment"
                        type="number"
                        placeholder="Введите вручную"
                        value={sovcomData.monthlyPayment || ''}
                        onChange={(e) => setSovcomData({...sovcomData, monthlyPayment: Number(e.target.value)})}
                      />
                    </div>
                  </div>

                  <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                    <p className="text-xs text-amber-800">
                      <Icon name="AlertTriangle" size={14} className="inline mr-1" />
                      Мораторий на досрочное погашение — 48 месяцев
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* ВТБ */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Icon name="Building" size={20} />
                      <span>Добросовестный заемщик</span>
                    </div>
                    <Badge className="bg-secondary">ВТБ Банк</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-sm text-slate-600 mb-2">Льготное автокредитование дилерских авто</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Процентная ставка:</span>
                        <span className="font-semibold">17,75% → 11,65%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Срок кредита:</span>
                        <span className="font-semibold">до 98 месяцев</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Первоначальный взнос:</span>
                        <span className="font-semibold">0,00 руб</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="vtb-limit">Одобренный кредитный лимит (руб)</Label>
                    <Input
                      id="vtb-limit"
                      type="number"
                      placeholder="0"
                      value={clientData.creditLimit || ''}
                      onChange={(e) => {
                        const limit = Number(e.target.value);
                        setClientData({...clientData, creditLimit: limit});
                        calculateVTB(limit);
                      }}
                    />
                  </div>

                  <div>
                    <Label htmlFor="vtb-client">Клиент (синхронизировано)</Label>
                    <Input
                      id="vtb-client"
                      value={clientData.clientName}
                      readOnly
                      className="bg-slate-100"
                    />
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Дополнительные продукты:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Страхование жизни (добровольное):</span>
                        <span className="font-medium">62 250 руб</span>
                      </div>
                      <div className="flex justify-between">
                        <span>КАСКО:</span>
                        <span className="font-medium">0 руб</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Карта помощи РАТ:</span>
                        <span className="font-medium">0 руб</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-semibold">Сумма кредита:</span>
                      <span className="font-bold text-lg">{vtbData.totalCredit.toLocaleString()} руб</span>
                    </div>
                    <div>
                      <Label htmlFor="vtb-payment">Ежемесячный платеж (руб)</Label>
                      <Input
                        id="vtb-payment"
                        type="number"
                        placeholder="Введите вручную"
                        value={vtbData.monthlyPayment || ''}
                        onChange={(e) => setVtbData({...vtbData, monthlyPayment: Number(e.target.value)})}
                      />
                    </div>
                  </div>

                  <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <p className="text-xs text-green-800">
                      <Icon name="CheckCircle" size={14} className="inline mr-1" />
                      Досрочное погашение доступно без штрафов
                    </p>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-xs text-blue-900 mb-1">Подарки от автосалона:</h4>
                    <ul className="text-xs text-blue-800 space-y-1">
                      <li>• Первое ТО в подарок</li>
                      <li>• Диагностика автомобиля в подарок</li>
                      <li>• Устранение недостатков</li>
                      <li>• Гарантия «КАРСО» на 1 год</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Кредитный калькулятор */}
          <TabsContent value="calculator">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Калькулятор */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Icon name="Calculator" size={20} />
                    <span>Кредитный калькулятор</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="calc-price">Стоимость автомобиля (руб)</Label>
                      <Input
                        id="calc-price"
                        type="number"
                        placeholder="Введите стоимость"
                        value={clientData.carPrice || ''}
                        onChange={(e) => {
                          const price = Number(e.target.value);
                          setClientData({...clientData, carPrice: price});
                          calculateSovcom(price);
                        }}
                      />
                    </div>

                    <div>
                      <Label htmlFor="calc-limit">Кредитный лимит ВТБ (руб)</Label>
                      <Input
                        id="calc-limit"
                        type="number"
                        placeholder="Введите лимит"
                        value={clientData.creditLimit || ''}
                        onChange={(e) => {
                          const limit = Number(e.target.value);
                          setClientData({...clientData, creditLimit: limit});
                          calculateVTB(limit);
                        }}
                      />
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <h4 className="font-semibold">Автоматические расчеты:</h4>
                      
                      <div className="bg-slate-50 p-3 rounded-lg">
                        <h5 className="font-medium text-sm mb-2">Совкомбанк Business Finance:</h5>
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between">
                            <span>Стоимость авто:</span>
                            <span>{sovcomData.carPrice.toLocaleString()} руб</span>
                          </div>
                          <div className="flex justify-between">
                            <span>+ Страховки:</span>
                            <span>1 061 950 руб</span>
                          </div>
                          <div className="flex justify-between font-semibold">
                            <span>Итого к кредиту:</span>
                            <span>{sovcomData.totalCredit.toLocaleString()} руб</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-lg">
                        <h5 className="font-medium text-sm mb-2">ВТБ Добросовестный заемщик:</h5>
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between">
                            <span>Кредитный лимит:</span>
                            <span>{vtbData.creditLimit.toLocaleString()} руб</span>
                          </div>
                          <div className="flex justify-between">
                            <span>+ Страхование жизни:</span>
                            <span>62 250 руб</span>
                          </div>
                          <div className="flex justify-between font-semibold">
                            <span>Итого к кредиту:</span>
                            <span>{vtbData.totalCredit.toLocaleString()} руб</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Результаты */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Icon name="BarChart3" size={20} />
                    <span>Результаты расчетов</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Совкомбанк результат */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">Совкомбанк</h4>
                        <Badge className="bg-primary">10,25%</Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Сумма кредита:</span>
                          <span className="font-semibold">{sovcomData.totalCredit.toLocaleString()} руб</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Ежемесячный платеж:</span>
                          <span className="font-semibold">{sovcomData.monthlyPayment.toLocaleString()} руб</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Срок:</span>
                          <span>60 месяцев</span>
                        </div>
                        <div className="flex justify-between text-red-600">
                          <span>Досрочное погашение:</span>
                          <span>❌ Запрещено 48 мес</span>
                        </div>
                      </div>
                    </div>

                    {/* ВТБ результат */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">ВТБ</h4>
                        <Badge className="bg-secondary">11,65%</Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Сумма кредита:</span>
                          <span className="font-semibold">{vtbData.totalCredit.toLocaleString()} руб</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Ежемесячный платеж:</span>
                          <span className="font-semibold">{vtbData.monthlyPayment.toLocaleString()} руб</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Срок:</span>
                          <span>до 98 месяцев</span>
                        </div>
                        <div className="flex justify-between text-green-600">
                          <span>Досрочное погашение:</span>
                          <span>✅ Разрешено</span>
                        </div>
                      </div>
                    </div>

                    {/* Рекомендация */}
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-2">Рекомендация системы:</h4>
                      <p className="text-sm text-blue-800">
                        {vtbData.totalCredit > 0 && sovcomData.totalCredit > 0 ? (
                          vtbData.totalCredit < sovcomData.totalCredit ? 
                          "ВТБ предлагает более выгодные условия по сумме кредита" :
                          "Совкомбанк может быть выгоднее по процентной ставке, но с обязательными страховками"
                        ) : "Введите данные для сравнения программ"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Сравнение */}
          <TabsContent value="comparison">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Icon name="BarChart3" size={20} />
                  <span>Сравнение банковских программ</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-slate-300">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="border border-slate-300 p-3 text-left">Параметр</th>
                        <th className="border border-slate-300 p-3 text-center">Совкомбанк</th>
                        <th className="border border-slate-300 p-3 text-center">ВТБ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-slate-300 p-3 font-medium">Процентная ставка</td>
                        <td className="border border-slate-300 p-3 text-center">10,25%</td>
                        <td className="border border-slate-300 p-3 text-center">17,75% → 11,65%</td>
                      </tr>
                      <tr className="bg-slate-50">
                        <td className="border border-slate-300 p-3 font-medium">Срок кредита</td>
                        <td className="border border-slate-300 p-3 text-center">60 месяцев</td>
                        <td className="border border-slate-300 p-3 text-center">до 98 месяцев</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-3 font-medium">Страхование жизни</td>
                        <td className="border border-slate-300 p-3 text-center">301 250 руб (обязательно)</td>
                        <td className="border border-slate-300 p-3 text-center">62 250 руб (добровольно)</td>
                      </tr>
                      <tr className="bg-slate-50">
                        <td className="border border-slate-300 p-3 font-medium">КАСКО</td>
                        <td className="border border-slate-300 p-3 text-center">473 250 руб</td>
                        <td className="border border-slate-300 p-3 text-center">0 руб</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-3 font-medium">Досрочное погашение</td>
                        <td className="border border-slate-300 p-3 text-center">❌ 48 месяцев</td>
                        <td className="border border-slate-300 p-3 text-center">✅ Доступно</td>
                      </tr>
                      <tr className="bg-slate-50">
                        <td className="border border-slate-300 p-3 font-medium">Сумма кредита</td>
                        <td className="border border-slate-300 p-3 text-center font-bold">{sovcomData.totalCredit.toLocaleString()} руб</td>
                        <td className="border border-slate-300 p-3 text-center font-bold">{vtbData.totalCredit.toLocaleString()} руб</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Дилерские автомобили */}
          <TabsContent value="dealer">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Icon name="Car" size={20} />
                  <span>Расчет дилерских автомобилей</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Icon name="Car" size={48} className="mx-auto text-slate-400 mb-4" />
                  <p className="text-slate-600">Специальный раздел для расчета дилерских автомобилей</p>
                  <p className="text-sm text-slate-400 mt-2">Интеграция с программой ВТБ "Добросовестный заемщик"</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;