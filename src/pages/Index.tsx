import React, { useState, useEffect } from 'react';
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
    interestRate: 10.25,
    creditTerm: 60,
    downPayment: 0,
    lifeInsurance: 301250,
    kasko: 473250,
    helpCard: 287450,
    monthlyPayment: 0,
    totalCredit: 0
  });

  const [vtbData, setVtbData] = useState({
    creditLimit: 0,
    interestRate: 11.65,
    creditTerm: 98,
    downPayment: 0,
    lifeInsurance: 62250,
    kasko: 0,
    helpCard: 0,
    monthlyPayment: 0,
    totalCredit: 0
  });

  const [dealerCarData, setDealerCarData] = useState({
    carModel: '',
    carYear: '',
    carPrice: 0,
    dealerName: '',
    isNew: true,
    vtbSyncData: {
      interestRate: 11.65,
      creditTerm: 98,
      downPayment: 0,
      lifeInsurance: 62250,
      kasko: 0,
      helpCard: 0,
      monthlyPayment: 0,
      totalCredit: 0
    }
  });

  // Автоматический расчет для Совкомбанка
  const calculateSovcom = (data: typeof sovcomData) => {
    const totalInsurance = data.lifeInsurance + data.kasko + data.helpCard;
    const creditAmount = data.carPrice - data.downPayment + totalInsurance;
    const monthlyRate = data.interestRate / 100 / 12;
    const monthlyPayment = creditAmount > 0 && data.creditTerm > 0 ? 
      creditAmount * (monthlyRate * Math.pow(1 + monthlyRate, data.creditTerm)) / (Math.pow(1 + monthlyRate, data.creditTerm) - 1) : 0;
    
    return {
      ...data,
      totalCredit: creditAmount,
      monthlyPayment: isNaN(monthlyPayment) ? 0 : Math.round(monthlyPayment)
    };
  };

  // Автоматический расчет для ВТБ
  const calculateVTB = (data: typeof vtbData) => {
    const totalInsurance = data.lifeInsurance + data.kasko + data.helpCard;
    const creditAmount = data.creditLimit - data.downPayment + totalInsurance;
    const monthlyRate = data.interestRate / 100 / 12;
    const monthlyPayment = creditAmount > 0 && data.creditTerm > 0 ? 
      creditAmount * (monthlyRate * Math.pow(1 + monthlyRate, data.creditTerm)) / (Math.pow(1 + monthlyRate, data.creditTerm) - 1) : 0;
    
    return {
      ...data,
      totalCredit: creditAmount,
      monthlyPayment: isNaN(monthlyPayment) ? 0 : Math.round(monthlyPayment)
    };
  };

  // Обновление Совкомбанк при изменении полей
  const updateSovcomField = (field: string, value: number) => {
    const newData = { ...sovcomData, [field]: value };
    setSovcomData(calculateSovcom(newData));
  };

  // Обновление ВТБ при изменении полей
  const updateVTBField = (field: string, value: number) => {
    const newData = { ...vtbData, [field]: value };
    setVtbData(calculateVTB(newData));
  };

  // Расчет для дилерского автомобиля (синхронизирован с ВТБ)
  const calculateDealerCar = (carPrice: number) => {
    const syncData = {
      ...dealerCarData.vtbSyncData,
      creditLimit: carPrice
    };
    const calculatedData = calculateVTB(syncData);
    
    setDealerCarData({
      ...dealerCarData,
      carPrice: carPrice,
      vtbSyncData: calculatedData
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
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="sovcom-rate">Процентная ставка (%)</Label>
                      <Input
                        id="sovcom-rate"
                        type="number"
                        step="0.01"
                        value={sovcomData.interestRate}
                        onChange={(e) => updateSovcomField('interestRate', Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="sovcom-term">Срок кредита (мес)</Label>
                      <Input
                        id="sovcom-term"
                        type="number"
                        value={sovcomData.creditTerm}
                        onChange={(e) => updateSovcomField('creditTerm', Number(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="sovcom-car-price">Стоимость автомобиля (руб)</Label>
                      <Input
                        id="sovcom-car-price"
                        type="number"
                        value={sovcomData.carPrice || ''}
                        onChange={(e) => updateSovcomField('carPrice', Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="sovcom-down">Первоначальный взнос (руб)</Label>
                      <Input
                        id="sovcom-down"
                        type="number"
                        value={sovcomData.downPayment || ''}
                        onChange={(e) => updateSovcomField('downPayment', Number(e.target.value))}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Страховые продукты (редактируемые):</h4>
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <Label htmlFor="sovcom-life">Страхование жизни (руб)</Label>
                        <Input
                          id="sovcom-life"
                          type="number"
                          value={sovcomData.lifeInsurance}
                          onChange={(e) => updateSovcomField('lifeInsurance', Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="sovcom-kasko">КАСКО (руб)</Label>
                        <Input
                          id="sovcom-kasko"
                          type="number"
                          value={sovcomData.kasko}
                          onChange={(e) => updateSovcomField('kasko', Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="sovcom-help">Карта помощи РАТ (руб)</Label>
                        <Input
                          id="sovcom-help"
                          type="number"
                          value={sovcomData.helpCard}
                          onChange={(e) => updateSovcomField('helpCard', Number(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="bg-slate-100 p-3 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span className="font-semibold">Сумма кредита:</span>
                        <span className="font-bold text-lg">{sovcomData.totalCredit.toLocaleString()} руб</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">Автоматический платеж:</span>
                        <span className="font-bold text-lg">{sovcomData.monthlyPayment.toLocaleString()} руб</span>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="sovcom-manual-payment">Ручная корректировка платежа (руб)</Label>
                      <Input
                        id="sovcom-manual-payment"
                        type="number"
                        placeholder="Введите для корректировки"
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

                  {/* Пояснения программы Совкомбанк */}
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-sm text-blue-900 mb-2">
                      <Icon name="Info" size={16} className="inline mr-1" />
                      Пояснения программы Business Finance:
                    </h4>
                    <p className="text-xs text-blue-800 leading-relaxed">
                      Банк партнер реализует свои Б/У автомобили через разные автосалоны только в кредит, 
                      занижая рыночную стоимость автомобиля и предоставляя свои кредитные условия, без возможности пересмотра. 
                      Сторонний банк не может аккредитовать автомобили Совкомбанка.
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
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="vtb-rate">Процентная ставка (%)</Label>
                      <Input
                        id="vtb-rate"
                        type="number"
                        step="0.01"
                        value={vtbData.interestRate}
                        onChange={(e) => updateVTBField('interestRate', Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="vtb-term">Срок кредита (мес)</Label>
                      <Input
                        id="vtb-term"
                        type="number"
                        value={vtbData.creditTerm}
                        onChange={(e) => updateVTBField('creditTerm', Number(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="vtb-limit">Кредитный лимит (руб)</Label>
                      <Input
                        id="vtb-limit"
                        type="number"
                        value={vtbData.creditLimit || ''}
                        onChange={(e) => updateVTBField('creditLimit', Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="vtb-down">Первоначальный взнос (руб)</Label>
                      <Input
                        id="vtb-down"
                        type="number"
                        value={vtbData.downPayment || ''}
                        onChange={(e) => updateVTBField('downPayment', Number(e.target.value))}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Дополнительные продукты (редактируемые):</h4>
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <Label htmlFor="vtb-life">Страхование жизни (руб)</Label>
                        <Input
                          id="vtb-life"
                          type="number"
                          value={vtbData.lifeInsurance}
                          onChange={(e) => updateVTBField('lifeInsurance', Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="vtb-kasko">КАСКО (руб)</Label>
                        <Input
                          id="vtb-kasko"
                          type="number"
                          value={vtbData.kasko}
                          onChange={(e) => updateVTBField('kasko', Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="vtb-help">Карта помощи РАТ (руб)</Label>
                        <Input
                          id="vtb-help"
                          type="number"
                          value={vtbData.helpCard}
                          onChange={(e) => updateVTBField('helpCard', Number(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="bg-slate-100 p-3 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span className="font-semibold">Сумма кредита:</span>
                        <span className="font-bold text-lg">{vtbData.totalCredit.toLocaleString()} руб</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">Автоматический платеж:</span>
                        <span className="font-bold text-lg">{vtbData.monthlyPayment.toLocaleString()} руб</span>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="vtb-manual-payment">Ручная корректировка платежа (руб)</Label>
                      <Input
                        id="vtb-manual-payment"
                        type="number"
                        placeholder="Введите для корректировки"
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

                  {/* Пояснения программы ВТБ */}
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-sm text-blue-900 mb-2">
                      <Icon name="Info" size={16} className="inline mr-1" />
                      Пояснения программы "Добросовестный заемщик":
                    </h4>
                    <p className="text-xs text-blue-800 leading-relaxed mb-2">
                      Предложение льготного автокредита от ПАО ВТБ Банка (кредитует только дилерские автомобили). 
                      Расчет сделан на одобренный кредитный лимит клиенту на покупку нового автомобиля или авто с пробегом.
                    </p>
                    <p className="text-xs text-blue-800 leading-relaxed">
                      Для точного расчета автомобиля нужно подгрузить данные по дилерскому автомобилю 
                      в разделе "Дилерские авто".
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Кредитный калькулятор */}
          <TabsContent value="calculator">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Сводная таблица */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Icon name="Calculator" size={20} />
                    <span>Сводная таблица параметров</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Параметр</th>
                          <th className="text-center p-2">Совкомбанк</th>
                          <th className="text-center p-2">ВТБ</th>
                        </tr>
                      </thead>
                      <tbody className="space-y-1">
                        <tr className="border-b">
                          <td className="p-2 font-medium">Процентная ставка</td>
                          <td className="p-2 text-center">{sovcomData.interestRate}%</td>
                          <td className="p-2 text-center">{vtbData.interestRate}%</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 font-medium">Срок кредита</td>
                          <td className="p-2 text-center">{sovcomData.creditTerm} мес</td>
                          <td className="p-2 text-center">{vtbData.creditTerm} мес</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 font-medium">Первоначальный взнос</td>
                          <td className="p-2 text-center">{sovcomData.downPayment.toLocaleString()}</td>
                          <td className="p-2 text-center">{vtbData.downPayment.toLocaleString()}</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 font-medium">Стоимость/Лимит</td>
                          <td className="p-2 text-center">{sovcomData.carPrice.toLocaleString()}</td>
                          <td className="p-2 text-center">{vtbData.creditLimit.toLocaleString()}</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 font-medium">Страхование жизни</td>
                          <td className="p-2 text-center">{sovcomData.lifeInsurance.toLocaleString()}</td>
                          <td className="p-2 text-center">{vtbData.lifeInsurance.toLocaleString()}</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 font-medium">КАСКО</td>
                          <td className="p-2 text-center">{sovcomData.kasko.toLocaleString()}</td>
                          <td className="p-2 text-center">{vtbData.kasko.toLocaleString()}</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 font-medium">Карта помощи РАТ</td>
                          <td className="p-2 text-center">{sovcomData.helpCard.toLocaleString()}</td>
                          <td className="p-2 text-center">{vtbData.helpCard.toLocaleString()}</td>
                        </tr>
                        <tr className="border-b bg-slate-50">
                          <td className="p-2 font-bold">Сумма кредита</td>
                          <td className="p-2 text-center font-bold">{sovcomData.totalCredit.toLocaleString()}</td>
                          <td className="p-2 text-center font-bold">{vtbData.totalCredit.toLocaleString()}</td>
                        </tr>
                        <tr className="border-b bg-blue-50">
                          <td className="p-2 font-bold">Ежемесячный платеж</td>
                          <td className="p-2 text-center font-bold text-blue-700">{sovcomData.monthlyPayment.toLocaleString()}</td>
                          <td className="p-2 text-center font-bold text-blue-700">{vtbData.monthlyPayment.toLocaleString()}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Результаты и рекомендации */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Icon name="BarChart3" size={20} />
                    <span>Анализ и рекомендации</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Переплата */}
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">Переплата по кредиту:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Совкомбанк:</span>
                        <span className="font-medium">
                          {((sovcomData.monthlyPayment * sovcomData.creditTerm) - sovcomData.totalCredit).toLocaleString()} руб
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>ВТБ:</span>
                        <span className="font-medium">
                          {((vtbData.monthlyPayment * vtbData.creditTerm) - vtbData.totalCredit).toLocaleString()} руб
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Экономия */}
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-2">Выгода:</h4>
                    <p className="text-sm text-green-700">
                      {sovcomData.monthlyPayment > 0 && vtbData.monthlyPayment > 0 ? (
                        sovcomData.monthlyPayment < vtbData.monthlyPayment ? 
                        `Совкомбанк выгоднее на ${(vtbData.monthlyPayment - sovcomData.monthlyPayment).toLocaleString()} руб/мес` :
                        `ВТБ выгоднее на ${(sovcomData.monthlyPayment - vtbData.monthlyPayment).toLocaleString()} руб/мес`
                      ) : "Введите данные для сравнения"}
                    </p>
                  </div>

                  {/* Особенности */}
                  <div className="space-y-3">
                    <div className="border rounded-lg p-3">
                      <h5 className="font-medium text-sm mb-2">Совкомбанк:</h5>
                      <ul className="text-xs text-slate-600 space-y-1">
                        <li>• Б/У автомобили банка</li>
                        <li>• Обязательные страховки</li>
                        <li>• Мораторий 48 месяцев</li>
                      </ul>
                    </div>
                    <div className="border rounded-lg p-3">
                      <h5 className="font-medium text-sm mb-2">ВТБ:</h5>
                      <ul className="text-xs text-slate-600 space-y-1">
                        <li>• Дилерские автомобили</li>
                        <li>• Подарки от автосалона</li>
                        <li>• Досрочное погашение</li>
                      </ul>
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
                  <span>Подробное сравнение программ</span>
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
                        <th className="border border-slate-300 p-3 text-center">Разница</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-slate-300 p-3 font-medium">Процентная ставка</td>
                        <td className="border border-slate-300 p-3 text-center">{sovcomData.interestRate}%</td>
                        <td className="border border-slate-300 p-3 text-center">{vtbData.interestRate}%</td>
                        <td className="border border-slate-300 p-3 text-center">
                          {(vtbData.interestRate - sovcomData.interestRate).toFixed(2)}%
                        </td>
                      </tr>
                      <tr className="bg-slate-50">
                        <td className="border border-slate-300 p-3 font-medium">Ежемесячный платеж</td>
                        <td className="border border-slate-300 p-3 text-center font-bold">{sovcomData.monthlyPayment.toLocaleString()} руб</td>
                        <td className="border border-slate-300 p-3 text-center font-bold">{vtbData.monthlyPayment.toLocaleString()} руб</td>
                        <td className="border border-slate-300 p-3 text-center font-bold">
                          {(vtbData.monthlyPayment - sovcomData.monthlyPayment).toLocaleString()} руб
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-3 font-medium">Общая переплата</td>
                        <td className="border border-slate-300 p-3 text-center">
                          {((sovcomData.monthlyPayment * sovcomData.creditTerm) - sovcomData.totalCredit).toLocaleString()} руб
                        </td>
                        <td className="border border-slate-300 p-3 text-center">
                          {((vtbData.monthlyPayment * vtbData.creditTerm) - vtbData.totalCredit).toLocaleString()} руб
                        </td>
                        <td className="border border-slate-300 p-3 text-center">
                          {(((vtbData.monthlyPayment * vtbData.creditTerm) - vtbData.totalCredit) - 
                            ((sovcomData.monthlyPayment * sovcomData.creditTerm) - sovcomData.totalCredit)).toLocaleString()} руб
                        </td>
                      </tr>
                      <tr className="bg-slate-50">
                        <td className="border border-slate-300 p-3 font-medium">Общие страховки</td>
                        <td className="border border-slate-300 p-3 text-center">
                          {(sovcomData.lifeInsurance + sovcomData.kasko + sovcomData.helpCard).toLocaleString()} руб
                        </td>
                        <td className="border border-slate-300 p-3 text-center">
                          {(vtbData.lifeInsurance + vtbData.kasko + vtbData.helpCard).toLocaleString()} руб
                        </td>
                        <td className="border border-slate-300 p-3 text-center">
                          {((vtbData.lifeInsurance + vtbData.kasko + vtbData.helpCard) - 
                            (sovcomData.lifeInsurance + sovcomData.kasko + sovcomData.helpCard)).toLocaleString()} руб
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Дилерские автомобили */}
          <TabsContent value="dealer">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Данные дилерского автомобиля */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Icon name="Car" size={20} />
                    <span>Дилерский автомобиль</span>
                    <Badge className="bg-secondary">Синхронизировано с ВТБ</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dealer-model">Модель автомобиля</Label>
                      <Input
                        id="dealer-model"
                        placeholder="Например: Toyota Camry"
                        value={dealerCarData.carModel}
                        onChange={(e) => setDealerCarData({...dealerCarData, carModel: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="dealer-year">Год выпуска</Label>
                      <Input
                        id="dealer-year"
                        type="number"
                        placeholder="2024"
                        value={dealerCarData.carYear}
                        onChange={(e) => setDealerCarData({...dealerCarData, carYear: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dealer-price">Стоимость автомобиля (руб)</Label>
                      <Input
                        id="dealer-price"
                        type="number"
                        placeholder="0"
                        value={dealerCarData.carPrice || ''}
                        onChange={(e) => calculateDealerCar(Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="dealer-name">Автосалон</Label>
                      <Input
                        id="dealer-name"
                        placeholder="Название дилера"
                        value={dealerCarData.dealerName}
                        onChange={(e) => setDealerCarData({...dealerCarData, dealerName: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Label>Состояние автомобиля:</Label>
                    <div className="flex space-x-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          checked={dealerCarData.isNew}
                          onChange={() => setDealerCarData({...dealerCarData, isNew: true})}
                        />
                        <span>Новый</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          checked={!dealerCarData.isNew}
                          onChange={() => setDealerCarData({...dealerCarData, isNew: false})}
                        />
                        <span>С пробегом</span>
                      </label>
                    </div>
                  </div>

                  <Separator />

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-sm text-blue-900 mb-2">
                      Подарки от автосалона (при покупке в кредит ВТБ):
                    </h4>
                    <ul className="text-xs text-blue-800 space-y-1">
                      <li>• Первое ТО в подарок</li>
                      <li>• Диагностика автомобиля в подарок</li>
                      <li>• Устранение недостатков</li>
                      <li>• Гарантия «КАРСО» на 1 год</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Расчет кредита для дилерского авто */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Icon name="Calculator" size={20} />
                    <span>Кредитный расчет</span>
                    <Badge className="bg-secondary">ВТБ</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">Параметры кредита (синхронизированы с ВТБ):</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex justify-between">
                        <span>Процентная ставка:</span>
                        <span className="font-semibold">{dealerCarData.vtbSyncData.interestRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Срок кредита:</span>
                        <span className="font-semibold">{dealerCarData.vtbSyncData.creditTerm} мес</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Стоимость авто:</span>
                        <span className="font-semibold">{dealerCarData.carPrice.toLocaleString()} руб</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Первый взнос:</span>
                        <span className="font-semibold">{dealerCarData.vtbSyncData.downPayment.toLocaleString()} руб</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Страховые продукты:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Страхование жизни:</span>
                        <span className="font-medium">{dealerCarData.vtbSyncData.lifeInsurance.toLocaleString()} руб</span>
                      </div>
                      <div className="flex justify-between">
                        <span>КАСКО:</span>
                        <span className="font-medium">{dealerCarData.vtbSyncData.kasko.toLocaleString()} руб</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Карта помощи РАТ:</span>
                        <span className="font-medium">{dealerCarData.vtbSyncData.helpCard.toLocaleString()} руб</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-3">Итоговый расчет:</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-semibold">Сумма кредита:</span>
                        <span className="font-bold text-lg">{dealerCarData.vtbSyncData.totalCredit.toLocaleString()} руб</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">Ежемесячный платеж:</span>
                        <span className="font-bold text-lg text-green-700">{dealerCarData.vtbSyncData.monthlyPayment.toLocaleString()} руб</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Переплата:</span>
                        <span>{((dealerCarData.vtbSyncData.monthlyPayment * dealerCarData.vtbSyncData.creditTerm) - dealerCarData.vtbSyncData.totalCredit).toLocaleString()} руб</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <p className="text-xs text-blue-800">
                      <Icon name="Sync" size={14} className="inline mr-1" />
                      Данные автоматически синхронизируются с программой ВТБ "Добросовестный заемщик"
                    </p>
                  </div>

                  <Button 
                    className="w-full" 
                    disabled={!dealerCarData.carModel || !dealerCarData.carPrice}
                  >
                    <Icon name="Download" size={16} className="mr-2" />
                    Сформировать предложение
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;