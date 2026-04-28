import { NextRequest, NextResponse } from "next/server";

const BIGBOOST_URL =
  process.env.BIGBOOST_URL ?? "https://plataforma.bigdatacorp.com.br/pessoas";

function calculateAge(birthDate: string): number {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

function buildMockResponse(taxID: string) {
  const masked = `${taxID.slice(0, 3)}*****${taxID.slice(-2)}`;
  return {
    Result: [
      {
        MatchKeys: `doc{${masked}}`,
        BasicData: {
          TaxIdNumber: masked,
          TaxIdCountry: "BRAZIL",
          AlternativeIdNumbers: {},
          Name: "NOME MOCKADO DA PESSOA",
          Aliases: {
            CommonName: "NOME MOCK",
            StandardizedName: "NOME MOCKADO DA PESSOA",
          },
          Gender: "M",
          BirthDate: "1990-01-15T00:00:00Z",
          CapturedBirthDateFromRFSource: "1990-01-15",
          IsValidBirthDateInRFSource: true,
          Age: calculateAge("1990-01-15T00:00:00Z"),
          ZodiacSign: "CAPRICORNIO",
          ChineseSign: "Horse",
          BirthCountry: "BRASILEIRA",
          MotherName: "NOME DA MAE MOCKADO",
          FatherName: "",
          MaritalStatusData: {},
          TaxIdStatus: "REGULAR",
          TaxIdOrigin: "RECEITA FEDERAL",
          HasObitIndication: false,
          CreationDate: "2010-03-10T00:00:00Z",
          LastUpdateDate: "2025-01-01T00:00:00Z",
        },
      },
    ],
    QueryId: `mock-${Date.now()}`,
    ElapsedMilliseconds: 42,
    QueryDate: new Date().toISOString(),
    Status: { basic_data: { Code: "OK", Message: "Query executed successfully" } },
    Evidences: {},
  };
}

export async function POST(request: NextRequest) {
  try {
    const { taxID } = await request.json();

    if (!taxID) {
      return NextResponse.json(
        { error: "taxID é obrigatório" },
        { status: 400 }
      );
    }

    const cleanTaxID = taxID.replace(/\D/g, "");

    if (cleanTaxID.length !== 11) {
      return NextResponse.json(
        { error: "BigBoost basic_data aceita apenas CPF (11 dígitos)" },
        { status: 400 }
      );
    }

    const accessToken = process.env.BIGBOOST_ACCESS_TOKEN;
    const tokenId = process.env.BIGBOOST_TOKEN_ID;

    // Se não tiver credenciais, retorna mock
    if (!accessToken || !tokenId) {
      const mock = buildMockResponse(cleanTaxID);
      const age = mock.Result[0].BasicData.Age;
      return NextResponse.json({
        mock: true,
        isAdult: age >= 18,
        age,
        birthDate: mock.Result[0].BasicData.BirthDate,
        raw: mock,
      });
    }

    const response = await fetch(BIGBOOST_URL, {
      method: "POST",
      headers: {
        AccessToken: accessToken,
        TokenId: tokenId,
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        Datasets: "basic_data",
        q: `doc{${cleanTaxID}}`,
        Limit: 1,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("BigBoost error:", error);
      return NextResponse.json(
        { error: "Erro ao consultar BigBoost" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const basicData = data?.Result?.[0]?.BasicData;

    if (!basicData?.BirthDate) {
      return NextResponse.json(
        { error: "Data de nascimento não encontrada" },
        { status: 404 }
      );
    }

    const age = calculateAge(basicData.BirthDate);

    return NextResponse.json({
      mock: false,
      isAdult: age >= 18,
      age,
      birthDate: basicData.BirthDate,
      raw: data,
    });
  } catch (error) {
    console.error("BigBoost API error:", error);
    return NextResponse.json(
      { error: "Erro interno ao consultar dados cadastrais" },
      { status: 500 }
    );
  }
}