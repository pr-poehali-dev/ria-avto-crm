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
  // Центральные параметры для всех программ
  const [centralParams, setCentralParams] = useState({
    // Общие данные автомобилей
    bankCarModel: 'Банковский автомобиль',
    bankCarYear: '2023',
    bankCarPrice: 3000000,
    dealerCarModel: '',
    dealerCarYear: '',
    dealerCarPrice: 0,
    
    // Параметры Business Finance (Совкомбанк)
    sovcom: {
      interestRate: 10.25,
      creditTerm: 60,
      downPayment: 500000,
      lifeInsurance: 301250,
      kasko: 473250,
      helpCard: 287450,
      monthlyPayment: 0,
    },
    
    // Параметры Добросовестный заемщик (ВТБ)
    vtb: {
      interestRateFirst: 14.5,
      interestRateSecond: 11.65,
      creditTerm: 98,
      creditLimit: 2500000,
      downPayment: 400000,
      lifeInsurance: 62250,
      kasko: 0,
      helpCard: 0,
      monthlyPaymentFirst: 0,
      monthlyPaymentSecond: 0,
    }
  });

  const [clientData, setClientData] = useState({
    date: '',
    clientNumber: '',
    clientName: '',
  });

  // Функции расчета
  const calculateSovcom = (params: any) => {
    const totalInsurance = params.sovcom.lifeInsurance + params.sovcom.kasko + params.sovcom.helpCard;
    const creditAmount = params.bankCarPrice - params.sovcom.downPayment + totalInsurance;
    const monthlyRate = params.sovcom.interestRate / 100 / 12;
    const monthlyPayment = creditAmount > 0 && params.sovcom.creditTerm > 0 ? 
      creditAmount * (monthlyRate * Math.pow(1 + monthlyRate, params.sovcom.creditTerm)) / (Math.pow(1 + monthlyRate, params.sovcom.creditTerm) - 1) : 0;
    
    return {
      totalCredit: creditAmount,
      monthlyPayment: isNaN(monthlyPayment) ? 0 : Math.round(monthlyPayment)
    };
  };

  const calculateVTB = (params: any) => {
    const totalInsurance = params.vtb.lifeInsurance + params.vtb.kasko + params.vtb.helpCard;
    const creditAmount = params.vtb.creditLimit - params.vtb.downPayment + totalInsurance;
    
    // Расчет первого платежа (первые 2 месяца)
    const monthlyRateFirst = params.vtb.interestRateFirst / 100 / 12;
    const monthlyPaymentFirst = creditAmount > 0 && params.vtb.creditTerm > 0 ? 
      creditAmount * (monthlyRateFirst * Math.pow(1 + monthlyRateFirst, params.vtb.creditTerm)) / (Math.pow(1 + monthlyRateFirst, params.vtb.creditTerm) - 1) : 0;
    
    // Расчет второго платежа (с 3 месяца)
    const monthlyRateSecond = params.vtb.interestRateSecond / 100 / 12;
    const monthlyPaymentSecond = creditAmount > 0 && params.vtb.creditTerm > 0 ? 
      creditAmount * (monthlyRateSecond * Math.pow(1 + monthlyRateSecond, params.vtb.creditTerm)) / (Math.pow(1 + monthlyRateSecond, params.vtb.creditTerm) - 1) : 0;
    
    return {
      totalCredit: creditAmount,
      monthlyPaymentFirst: isNaN(monthlyPaymentFirst) ? 0 : Math.round(monthlyPaymentFirst),
      monthlyPaymentSecond: isNaN(monthlyPaymentSecond) ? 0 : Math.round(monthlyPaymentSecond)
    };
  };

  // Генерация графика платежей
  const generatePaymentSchedule = (creditAmount: number, rate: number, term: number, isFirst: boolean = false) => {
    const schedule = [];
    const monthlyRate = rate / 100 / 12;
    const monthlyPayment = creditAmount * (monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1);
    
    let remainingBalance = creditAmount;
    
    for (let month = 1; month <= (isFirst ? 2 : term); month++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      remainingBalance -= principalPayment;
      
      schedule.push({
        month,
        monthlyPayment: Math.round(monthlyPayment),
        principalPayment: Math.round(principalPayment),
        interestPayment: Math.round(interestPayment),
        remainingBalance: Math.round(Math.max(0, remainingBalance))
      });
    }
    
    return schedule;
  };

  // Обновление центральных параметров
  const updateCentralParam = (path: string, value: any) => {
    const pathArray = path.split('.');
    setCentralParams(prevParams => {
      const newParams = { ...prevParams };
      let current = newParams;
      
      for (let i = 0; i < pathArray.length - 1; i++) {
        current = current[pathArray[i]];
      }
      current[pathArray[pathArray.length - 1]] = value;
      
      return newParams;
    });
  };

  // Вычисленные значения для отображения
  const sovcomCalculated = calculateSovcom(centralParams);
  const vtbCalculated = calculateVTB(centralParams);

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
          <TabsList className="grid w-full grid-cols-6 bg-slate-900 text-white">
            <TabsTrigger value="programs" className="data-[state=active]:bg-white data-[state=active]:text-black text-white">Программы банков</TabsTrigger>
            <TabsTrigger value="parameters" className="data-[state=active]:bg-white data-[state=active]:text-black text-white">Параметры</TabsTrigger>
            <TabsTrigger value="calculator" className="data-[state=active]:bg-white data-[state=active]:text-black text-white">Кредитный калькулятор</TabsTrigger>
            <TabsTrigger value="comparison" className="data-[state=active]:bg-white data-[state=active]:text-black text-white">Сравнение</TabsTrigger>
            <TabsTrigger value="dealer" className="data-[state=active]:bg-white data-[state=active]:text-black text-white">Дилерские авто</TabsTrigger>
            <TabsTrigger value="final" className="data-[state=active]:bg-white data-[state=active]:text-black text-white">Итоговый расчет</TabsTrigger>
          </TabsList>

          {/* Параметры - новая вкладка для централизованного управления */}
          <TabsContent value="parameters" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Данные автомобилей */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Icon name="Car" size={20} />
                    <span>Информация по автомобилям</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <h4 className="font-semibold text-sm">Банковский автомобиль (Совкомбанк)</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Модель</Label>
                      <Input
                        value={centralParams.bankCarModel}
                        onChange={(e) => updateCentralParam('bankCarModel', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Год выпуска</Label>
                      <Input
                        value={centralParams.bankCarYear}
                        onChange={(e) => updateCentralParam('bankCarYear', e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Стоимость (руб)</Label>
                    <Input
                      type="number"
                      value={centralParams.bankCarPrice}
                      onChange={(e) => updateCentralParam('bankCarPrice', Number(e.target.value))}
                    />
                  </div>
                  
                  <Separator />
                  
                  <h4 className="font-semibold text-sm">Дилерский автомобиль (ВТБ)</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Модель</Label>
                      <Input
                        placeholder="Например: Toyota Camry"
                        value={centralParams.dealerCarModel}
                        onChange={(e) => updateCentralParam('dealerCarModel', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Год выпуска</Label>
                      <Input
                        placeholder="2024"
                        value={centralParams.dealerCarYear}
                        onChange={(e) => updateCentralParam('dealerCarYear', e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Стоимость (руб)</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={centralParams.dealerCarPrice || ''}
                      onChange={(e) => updateCentralParam('dealerCarPrice', Number(e.target.value))}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Параметры Business Finance */}
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
                      <Label>Процентная ставка (%)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={centralParams.sovcom.interestRate}
                        onChange={(e) => updateCentralParam('sovcom.interestRate', Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label>Срок кредита (мес)</Label>
                      <Input
                        type="number"
                        value={centralParams.sovcom.creditTerm}
                        onChange={(e) => updateCentralParam('sovcom.creditTerm', Number(e.target.value))}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label>Первоначальный взнос (руб)</Label>
                    <Input
                      type="number"
                      value={centralParams.sovcom.downPayment}
                      onChange={(e) => updateCentralParam('sovcom.downPayment', Number(e.target.value))}
                    />
                  </div>

                  <div className="space-y-3">
                    <h5 className="font-medium text-sm">Страховые продукты:</h5>
                    <div>
                      <Label>Страхование жизни (руб)</Label>
                      <Input
                        type="number"
                        value={centralParams.sovcom.lifeInsurance}
                        onChange={(e) => updateCentralParam('sovcom.lifeInsurance', Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label>КАСКО (руб)</Label>
                      <Input
                        type="number"
                        value={centralParams.sovcom.kasko}
                        onChange={(e) => updateCentralParam('sovcom.kasko', Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label>Карта помощи РАТ (руб)</Label>
                      <Input
                        type="number"
                        value={centralParams.sovcom.helpCard}
                        onChange={(e) => updateCentralParam('sovcom.helpCard', Number(e.target.value))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Ежемесячный платеж (руб)</Label>
                    <Input
                      type="number"
                      value={centralParams.sovcom.monthlyPayment || sovcomCalculated.monthlyPayment}
                      onChange={(e) => updateCentralParam('sovcom.monthlyPayment', Number(e.target.value))}
                    />
                  </div>

                  <div className="bg-slate-100 p-3 rounded-lg">
                    <div className="text-sm">
                      <div className="flex justify-between">
                        <span>Сумма кредита:</span>
                        <span className="font-bold">{sovcomCalculated.totalCredit.toLocaleString()} руб</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Параметры Добросовестный заемщик */}
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Первичный график платежей */}
                  <div className="space-y-4">
                    <h5 className="font-medium text-sm text-orange-700">Параметры первого графика (первые 2 платежа):</h5>
                    <div>
                      <Label>Процентная ставка первые 2 платежа (%)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={centralParams.vtb.interestRateFirst}
                        onChange={(e) => updateCentralParam('vtb.interestRateFirst', Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label>Аннуитетный ежемесячный платеж (руб)</Label>
                      <Input
                        type="number"
                        value={centralParams.vtb.monthlyPaymentFirst || vtbCalculated.monthlyPaymentFirst}
                        onChange={(e) => updateCentralParam('vtb.monthlyPaymentFirst', Number(e.target.value))}
                      />
                    </div>
                  </div>

                  {/* Второй график платежей */}
                  <div className="space-y-4">
                    <h5 className="font-medium text-sm text-green-700">Параметры второго графика (с 3 платежа):</h5>
                    <div>
                      <Label>Согласованная процентная ставка с 3 платежа (%)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={centralParams.vtb.interestRateSecond}
                        onChange={(e) => updateCentralParam('vtb.interestRateSecond', Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label>Аннуитетный ежемесячный платеж (руб)</Label>
                      <Input
                        type="number"
                        value={centralParams.vtb.monthlyPaymentSecond || vtbCalculated.monthlyPaymentSecond}
                        onChange={(e) => updateCentralParam('vtb.monthlyPaymentSecond', Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Срок кредита (мес)</Label>
                    <Input
                      type="number"
                      value={centralParams.vtb.creditTerm}
                      onChange={(e) => updateCentralParam('vtb.creditTerm', Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label>Кредитный лимит (стоимость автомобиля) (руб)</Label>
                    <Input
                      type="number"
                      value={centralParams.vtb.creditLimit}
                      onChange={(e) => updateCentralParam('vtb.creditLimit', Number(e.target.value))}
                    />
                  </div>
                </div>

                <div>
                  <Label>Первоначальный взнос (руб)</Label>
                  <Input
                    type="number"
                    value={centralParams.vtb.downPayment}
                    onChange={(e) => updateCentralParam('vtb.downPayment', Number(e.target.value))}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Страхование жизни (руб)</Label>
                    <Input
                      type="number"
                      value={centralParams.vtb.lifeInsurance}
                      onChange={(e) => updateCentralParam('vtb.lifeInsurance', Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label>КАСКО (руб)</Label>
                    <Input
                      type="number"
                      value={centralParams.vtb.kasko}
                      onChange={(e) => updateCentralParam('vtb.kasko', Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label>Карта помощи РАТ (руб)</Label>
                    <Input
                      type="number"
                      value={centralParams.vtb.helpCard}
                      onChange={(e) => updateCentralParam('vtb.helpCard', Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="bg-slate-100 p-3 rounded-lg">
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Сумма кредита:</span>
                      <span className="font-bold">{vtbCalculated.totalCredit.toLocaleString()} руб</span>
                    </div>
                    <div className="flex justify-between text-orange-700">
                      <span>Платеж первые 2 мес:</span>
                      <span className="font-bold">{vtbCalculated.monthlyPaymentFirst.toLocaleString()} руб</span>
                    </div>
                    <div className="flex justify-between text-green-700">
                      <span>Платеж с 3 месяца:</span>
                      <span className="font-bold">{vtbCalculated.monthlyPaymentSecond.toLocaleString()} руб</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Программы банков */}
          <TabsContent value="programs" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Совкомбанк - только отображение */}
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
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Процентная ставка:</span>
                        <span className="font-semibold">{centralParams.sovcom.interestRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Срок кредита:</span>
                        <span className="font-semibold">{centralParams.sovcom.creditTerm} мес</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Стоимость автомобиля:</span>
                        <span className="font-semibold">{centralParams.bankCarPrice.toLocaleString()} руб</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Первоначальный взнос:</span>
                        <span className="font-semibold">{centralParams.sovcom.downPayment.toLocaleString()} руб</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Страховые продукты:</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Страхование жизни:</span>
                        <span>{centralParams.sovcom.lifeInsurance.toLocaleString()} руб</span>
                      </div>
                      <div className="flex justify-between">
                        <span>КАСКО:</span>
                        <span>{centralParams.sovcom.kasko.toLocaleString()} руб</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Карта помощи РАТ:</span>
                        <span>{centralParams.sovcom.helpCard.toLocaleString()} руб</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-semibold">Сумма кредита:</span>
                        <span className="font-bold text-lg">{sovcomCalculated.totalCredit.toLocaleString()} руб</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">Ежемесячный платеж:</span>
                        <span className="font-bold text-lg text-green-700">{sovcomCalculated.monthlyPayment.toLocaleString()} руб</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                    <p className="text-xs text-amber-800">
                      <Icon name="AlertTriangle" size={14} className="inline mr-1" />
                      Мораторий на досрочное погашение — 48 месяцев
                    </p>
                  </div>

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

              {/* ВТБ - только отображение с двумя ставками */}
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
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Процентная ставка первые 2 платежа:</span>
                        <span className="font-semibold text-orange-700">{centralParams.vtb.interestRateFirst}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Согласованная ставка с 3 платежа:</span>
                        <span className="font-semibold text-green-700">{centralParams.vtb.interestRateSecond}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Срок кредита:</span>
                        <span className="font-semibold">{centralParams.vtb.creditTerm} мес</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Кредитный лимит:</span>
                        <span className="font-semibold">{centralParams.vtb.creditLimit.toLocaleString()} руб</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Первоначальный взнос:</span>
                        <span className="font-semibold">{centralParams.vtb.downPayment.toLocaleString()} руб</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Дополнительные продукты:</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Страхование жизни:</span>
                        <span>{centralParams.vtb.lifeInsurance.toLocaleString()} руб</span>
                      </div>
                      <div className="flex justify-between">
                        <span>КАСКО:</span>
                        <span>{centralParams.vtb.kasko.toLocaleString()} руб</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Карта помощи РАТ:</span>
                        <span>{centralParams.vtb.helpCard.toLocaleString()} руб</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-semibold">Сумма кредита:</span>
                        <span className="font-bold text-lg">{vtbCalculated.totalCredit.toLocaleString()} руб</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold text-orange-700">Платеж первые 2 мес:</span>
                        <span className="font-bold text-lg text-orange-700">{vtbCalculated.monthlyPaymentFirst.toLocaleString()} руб</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold text-green-700">Платеж с 3 месяца:</span>
                        <span className="font-bold text-lg text-green-700">{vtbCalculated.monthlyPaymentSecond.toLocaleString()} руб</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <p className="text-xs text-green-800">
                      <Icon name="CheckCircle" size={14} className="inline mr-1" />
                      Досрочное погашение доступно без штрафов
                    </p>
                  </div>

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
                      Льготная процентная ставка предоставляется с 3 платежа при условии своевременной оплаты первых двух платежей.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Итоговый расчет - новая вкладка */}
          <TabsContent value="final" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Icon name="FileText" size={20} />
                  <span>Итоговый расчет по программе "Добросовестный заемщик"</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Информация по автомобилю */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-3">Выбранный дилерский автомобиль:</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span>Модель:</span>
                      <span className="font-semibold">{centralParams.dealerCarModel || 'Не указана'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Год выпуска:</span>
                      <span className="font-semibold">{centralParams.dealerCarYear || 'Не указан'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Стоимость:</span>
                      <span className="font-semibold">{centralParams.dealerCarPrice.toLocaleString()} руб</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Первоначальный взнос:</span>
                      <span className="font-semibold">{centralParams.vtb.downPayment.toLocaleString()} руб</span>
                    </div>
                  </div>
                </div>

                {/* Пояснение программы */}
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-900 mb-2">
                    <Icon name="Info" size={16} className="inline mr-1" />
                    Особенности программы "Добросовестный заемщик":
                  </h4>
                  <p className="text-sm text-yellow-800 leading-relaxed">
                    По данной льготной программе автокредитования клиенту предоставляется возможность снижения процентной 
                    ставки с <strong>{centralParams.vtb.interestRateFirst}%</strong> до <strong>{centralParams.vtb.interestRateSecond}%</strong> начиная 
                    с третьего платежа при условии своевременной оплаты первых двух платежей без просрочек.
                  </p>
                </div>

                {/* Два графика платежей */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Первичный график */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg text-orange-700">
                        Первичный график платежей
                      </CardTitle>
                      <p className="text-sm text-slate-600">
                        Первые 2 платежа с повышенной ставкой {centralParams.vtb.interestRateFirst}%
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse border border-slate-300">
                          <thead>
                            <tr className="bg-orange-100">
                              <th className="border border-slate-300 p-2">№</th>
                              <th className="border border-slate-300 p-2">Платеж</th>
                              <th className="border border-slate-300 p-2">Основной долг</th>
                              <th className="border border-slate-300 p-2">Проценты</th>
                              <th className="border border-slate-300 p-2">Остаток</th>
                            </tr>
                          </thead>
                          <tbody>
                            {generatePaymentSchedule(vtbCalculated.totalCredit, centralParams.vtb.interestRateFirst, centralParams.vtb.creditTerm, true).map((payment) => (
                              <tr key={payment.month}>
                                <td className="border border-slate-300 p-2 text-center">{payment.month}</td>
                                <td className="border border-slate-300 p-2 text-right">{payment.monthlyPayment.toLocaleString()}</td>
                                <td className="border border-slate-300 p-2 text-right">{payment.principalPayment.toLocaleString()}</td>
                                <td className="border border-slate-300 p-2 text-right">{payment.interestPayment.toLocaleString()}</td>
                                <td className="border border-slate-300 p-2 text-right">{payment.remainingBalance.toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Второй график */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg text-green-700">
                        Второй график платежей
                      </CardTitle>
                      <p className="text-sm text-slate-600">
                        С 3 месяца со сниженной ставкой {centralParams.vtb.interestRateSecond}%
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse border border-slate-300">
                          <thead>
                            <tr className="bg-green-100">
                              <th className="border border-slate-300 p-2">№</th>
                              <th className="border border-slate-300 p-2">Платеж</th>
                              <th className="border border-slate-300 p-2">Основной долг</th>
                              <th className="border border-slate-300 p-2">Проценты</th>
                              <th className="border border-slate-300 p-2">Остаток</th>
                            </tr>
                          </thead>
                          <tbody>
                            {generatePaymentSchedule(vtbCalculated.totalCredit, centralParams.vtb.interestRateSecond, centralParams.vtb.creditTerm).slice(2, 7).map((payment, index) => (
                              <tr key={payment.month}>
                                <td className="border border-slate-300 p-2 text-center">{index + 3}</td>
                                <td className="border border-slate-300 p-2 text-right">{payment.monthlyPayment.toLocaleString()}</td>
                                <td className="border border-slate-300 p-2 text-right">{payment.principalPayment.toLocaleString()}</td>
                                <td className="border border-slate-300 p-2 text-right">{payment.interestPayment.toLocaleString()}</td>
                                <td className="border border-slate-300 p-2 text-right">{payment.remainingBalance.toLocaleString()}</td>
                              </tr>
                            ))}
                            <tr className="bg-slate-100">
                              <td className="border border-slate-300 p-2 text-center font-semibold">...</td>
                              <td className="border border-slate-300 p-2 text-center font-semibold">...</td>
                              <td className="border border-slate-300 p-2 text-center font-semibold">...</td>
                              <td className="border border-slate-300 p-2 text-center font-semibold">...</td>
                              <td className="border border-slate-300 p-2 text-center font-semibold">...</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Итоговая сводка */}
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Итоговая сводка по кредиту:</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span>Сумма кредита:</span>
                      <span className="font-bold">{vtbCalculated.totalCredit.toLocaleString()} руб</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Срок кредитования:</span>
                      <span className="font-bold">{centralParams.vtb.creditTerm} месяцев</span>
                    </div>
                    <div className="flex justify-between text-orange-700">
                      <span>Платеж первые 2 мес:</span>
                      <span className="font-bold">{vtbCalculated.monthlyPaymentFirst.toLocaleString()} руб</span>
                    </div>
                    <div className="flex justify-between text-green-700">
                      <span>Платеж с 3 месяца:</span>
                      <span className="font-bold">{vtbCalculated.monthlyPaymentSecond.toLocaleString()} руб</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Экономия в месяц с 3 платежа:</span>
                      <span className="font-bold text-green-600">
                        {(vtbCalculated.monthlyPaymentFirst - vtbCalculated.monthlyPaymentSecond).toLocaleString()} руб
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Остальные вкладки остаются без изменений, но используют centralParams */}
          <TabsContent value="calculator">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                      <tbody>
                        <tr className="border-b">
                          <td className="p-2 font-medium">Процентная ставка</td>
                          <td className="p-2 text-center">{centralParams.sovcom.interestRate}%</td>
                          <td className="p-2 text-center">{centralParams.vtb.interestRateFirst}% / {centralParams.vtb.interestRateSecond}%</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 font-medium">Срок кредита</td>
                          <td className="p-2 text-center">{centralParams.sovcom.creditTerm} мес</td>
                          <td className="p-2 text-center">{centralParams.vtb.creditTerm} мес</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 font-medium">Первоначальный взнос</td>
                          <td className="p-2 text-center">{centralParams.sovcom.downPayment.toLocaleString()}</td>
                          <td className="p-2 text-center">{centralParams.vtb.downPayment.toLocaleString()}</td>
                        </tr>
                        <tr className="border-b bg-slate-50">
                          <td className="p-2 font-bold">Сумма кредита</td>
                          <td className="p-2 text-center font-bold">{sovcomCalculated.totalCredit.toLocaleString()}</td>
                          <td className="p-2 text-center font-bold">{vtbCalculated.totalCredit.toLocaleString()}</td>
                        </tr>
                        <tr className="border-b bg-blue-50">
                          <td className="p-2 font-bold">Ежемесячный платеж</td>
                          <td className="p-2 text-center font-bold text-blue-700">{sovcomCalculated.monthlyPayment.toLocaleString()}</td>
                          <td className="p-2 text-center font-bold text-blue-700">{vtbCalculated.monthlyPaymentSecond.toLocaleString()}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Icon name="BarChart3" size={20} />
                    <span>Анализ и рекомендации</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-2">Выгода ВТБ:</h4>
                    <p className="text-sm text-green-700">
                      Экономия на платеже с 3 месяца: {(vtbCalculated.monthlyPaymentFirst - vtbCalculated.monthlyPaymentSecond).toLocaleString()} руб/мес
                    </p>
                  </div>

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
                        <li>• Льготная ставка с 3 месяца</li>
                        <li>• Досрочное погашение</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

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
                        <td className="border border-slate-300 p-3 text-center">{centralParams.sovcom.interestRate}%</td>
                        <td className="border border-slate-300 p-3 text-center">{centralParams.vtb.interestRateFirst}% / {centralParams.vtb.interestRateSecond}%</td>
                        <td className="border border-slate-300 p-3 text-center">Переменная</td>
                      </tr>
                      <tr className="bg-slate-50">
                        <td className="border border-slate-300 p-3 font-medium">Платеж (основной)</td>
                        <td className="border border-slate-300 p-3 text-center font-bold">{sovcomCalculated.monthlyPayment.toLocaleString()} руб</td>
                        <td className="border border-slate-300 p-3 text-center font-bold">{vtbCalculated.monthlyPaymentSecond.toLocaleString()} руб</td>
                        <td className="border border-slate-300 p-3 text-center font-bold">
                          {(vtbCalculated.monthlyPaymentSecond - sovcomCalculated.monthlyPayment).toLocaleString()} руб
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dealer">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Icon name="Car" size={20} />
                    <span>Дилерский автомобиль</span>
                    <Badge className="bg-secondary">Синхронизировано</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">Основные параметры автомобиля:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Марка и модель:</span>
                        <span className="font-semibold">{centralParams.dealerCarModel || 'Не указана'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Год выпуска:</span>
                        <span className="font-semibold">{centralParams.dealerCarYear || 'Не указан'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Стоимость:</span>
                        <span className="font-semibold">{centralParams.dealerCarPrice.toLocaleString()} руб</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold text-yellow-900 mb-2">
                      <Icon name="Info" size={16} className="inline mr-1" />
                      Программа "Добросовестный заемщик":
                    </h4>
                    <p className="text-sm text-yellow-800 leading-relaxed">
                      По согласованной программе в случае недопущения просрочек по показательным первым двум платежам, 
                      клиенту согласована льготная процентная ставка по автокредиту с <strong>{centralParams.vtb.interestRateFirst}%</strong> до <strong>{centralParams.vtb.interestRateSecond}%</strong> начиная с третьего платежа.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                      <h5 className="font-medium text-orange-800">Первичный график платежей (первые 2 месяца):</h5>
                      <p className="text-lg font-bold text-orange-700">{vtbCalculated.monthlyPaymentFirst.toLocaleString()} руб/мес</p>
                    </div>
                    
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <h5 className="font-medium text-green-800">Второй график платежей (с 3 месяца):</h5>
                      <p className="text-lg font-bold text-green-700">{vtbCalculated.monthlyPaymentSecond.toLocaleString()} руб/мес</p>
                    </div>
                  </div>

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

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Icon name="Calculator" size={20} />
                    <span>Кредитные условия</span>
                    <Badge className="bg-secondary">ВТБ</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">Параметры кредита:</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex justify-between">
                        <span>Ставка первые 2 мес:</span>
                        <span className="font-semibold text-orange-700">{centralParams.vtb.interestRateFirst}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ставка с 3 месяца:</span>
                        <span className="font-semibold text-green-700">{centralParams.vtb.interestRateSecond}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Срок кредита:</span>
                        <span className="font-semibold">{centralParams.vtb.creditTerm} мес</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Первый взнос:</span>
                        <span className="font-semibold">{centralParams.vtb.downPayment.toLocaleString()} руб</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Страховые продукты:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Страхование жизни:</span>
                        <span className="font-medium">{centralParams.vtb.lifeInsurance.toLocaleString()} руб</span>
                      </div>
                      <div className="flex justify-between">
                        <span>КАСКО:</span>
                        <span className="font-medium">{centralParams.vtb.kasko.toLocaleString()} руб</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Карта помощи РАТ:</span>
                        <span className="font-medium">{centralParams.vtb.helpCard.toLocaleString()} руб</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-3">Итоговый расчет:</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-semibold">Сумма кредита:</span>
                        <span className="font-bold text-lg">{vtbCalculated.totalCredit.toLocaleString()} руб</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold text-orange-700">Платеж первые 2 мес:</span>
                        <span className="font-bold text-lg text-orange-700">{vtbCalculated.monthlyPaymentFirst.toLocaleString()} руб</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold text-green-700">Платеж с 3 месяца:</span>
                        <span className="font-bold text-lg text-green-700">{vtbCalculated.monthlyPaymentSecond.toLocaleString()} руб</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <p className="text-xs text-blue-800">
                      <Icon name="Sync" size={14} className="inline mr-1" />
                      Данные синхронизируются из вкладки "Параметры"
                    </p>
                  </div>

                  <Button className="w-full">
                    <Icon name="Download" size={16} className="mr-2" />
                    Сформировать предложение
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Подвал сайта */}
      <footer className="bg-slate-900 text-slate-300 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="text-center">
            <p className="text-xs leading-relaxed">
              CRM 2025 Все права защищены. Вся представленная на сайте информация носит исключительно информационный характер 
              и не является публичной офертой, определяемой положениями Статьи 437 Гражданского кодекса Российской Федерации.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;