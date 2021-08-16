const request = require('request');
let fs = require('fs');
const queue = 'hello'
const util = require("util");
let STATE = 'SEND_TO_RD'
module.exports = (fastify) => ({
    sendToRD: async (host, headers, multipart = []) => {
        const options = {
            method: 'POST',
            url: host,
            headers: headers,
            multipart: multipart
            // multipart: [
            //     {
            //         "Content-Type": "text/xml; charset=utf-8",
            //         "Content-ID" : "ebXML-Header",
            //         "body" : "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\n" +
            //             "<SOAP:Envelope\n" +
            //             "xmlns:SOAP=\"http://schemas.xmlsoap.org/soap/envelope/\"\n" +
            //             "xmlns:xlink=\"http://www.w3.org/1999/xlink\"\n" +
            //             "xmlns:eb=\"http://www.oasis-open.org/committees/ebxml-msg/schema/msg-header-2_0.xsd\"\n" +
            //             "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"\n" +
            //             "xsi:schemaLocation=\"http://www.oasis-open.org/committees/ebxml-cppa/schema/cpp-cpa-2_0.xsd\"\n" +
            //             "xmlns:tns=\"http://www.oasis-open.org/committees/ebxml-cppa/schema/cpp-cpa-2_0.xsd\">\n" +
            //             "\t<SOAP:Header>\n" +
            //             "\t\t<eb:MessageHeader SOAP:mustUnderstand=\"1\" eb:version=\"2.0\">\n" +
            //             "\t\t\t<eb:From>\n" +
            //             "\t\t\t\t<eb:PartyId eb:type=\"string\">0105553045044</eb:PartyId>\n" +
            //             "\t\t\t\t<eb:Role>HOST_TO_HOST</eb:Role>\n" +
            //             "\t\t\t</eb:From>\n" +
            //             "\t\t\t<eb:To>\n" +
            //             "\t\t\t\t<eb:PartyId eb:type=\"string\">THRD</eb:PartyId>\n" +
            //             "\t\t\t\t<eb:Role>THRD</eb:Role>\n" +
            //             "\t\t\t</eb:To>\n" +
            //             "\t\t\t<eb:CPAId eb:type=\"string\">THRD_ETAXINVOICE_0105553045044_HH_TEST_1.00_b7</eb:CPAId>\n" +
            //             "\t\t\t<eb:ConversationId>TT010555304504420064000000011</eb:ConversationId>\n" +
            //             "\t\t\t<eb:Service eb:type=\"string\">THRD.eTaxInvoice</eb:Service>\n" +
            //             "\t\t\t<eb:Action>TIV</eb:Action>\n" +
            //             "\t\t\t<eb:MessageData>\n" +
            //             "\t\t\t\t<eb:MessageId>20001209-133003-8572@example.com</eb:MessageId>\n" +
            //             "\t\t\t\t<eb:Timestamp>2021-07-29T11:12:12.000+07:00</eb:Timestamp>\n" +
            //             "\t\t\t</eb:MessageData>\n" +
            //             "\t\t</eb:MessageHeader>\n" +
            //             "\t</SOAP:Header>\n" +
            //             "\t<SOAP:Body>\n" +
            //             "    </SOAP:Body>\n" +
            //             "</SOAP:Envelope>"
            //     },
            //     {
            //         "Content-Type": "text/xml; charset=utf-8",
            //         "Content-ID" : "ebXML-Payload",
            //         "body" : "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
            //             "<rsm:TaxInvoice_CrossIndustryInvoice xmlns:rsm=\"urn:etda:uncefact:data:standard:TaxInvoice_CrossIndustryInvoice:2\" xmlns:ns3=\"http://www.w3.org/2000/09/xmldsig#\" xmlns:ram=\"urn:etda:uncefact:data:standard:TaxInvoice_ReusableAggregateBusinessInformationEntity:2\">\n" +
            //             "   <rsm:ExchangedDocumentContext>\n" +
            //             "      <ram:GuidelineSpecifiedDocumentContextParameter>\n" +
            //             "         <ram:ID schemeAgencyID=\"ETDA\" schemeVersionID=\"v2.0\">ER3-2560</ram:ID>\n" +
            //             "      </ram:GuidelineSpecifiedDocumentContextParameter>\n" +
            //             "   </rsm:ExchangedDocumentContext>\n" +
            //             "   <rsm:ExchangedDocument>\n" +
            //             "      <ram:ID>PEKDEV20210713X001</ram:ID>\n" +
            //             "      <ram:Name>ใบเสร็จรับเงิน/ใบกำกับภาษี</ram:Name>\n" +
            //             "      <ram:TypeCode>T03</ram:TypeCode>\n" +
            //             "      <ram:IssueDateTime>2020-09-25T00:00:00.000Z</ram:IssueDateTime>\n" +
            //             "      <ram:CreationDateTime>2020-09-25T00:00:00.000Z</ram:CreationDateTime>\n" +
            //             "   </rsm:ExchangedDocument>\n" +
            //             "   <rsm:SupplyChainTradeTransaction>\n" +
            //             "      <ram:ApplicableHeaderTradeAgreement>\n" +
            //             "         <ram:SellerTradeParty>\n" +
            //             "            <ram:Name>บริษัท ทรู มูฟ เอช ยูนิเวอร์แซล คอมมิวนิเคชั่น จำกัด</ram:Name>\n" +
            //             "            <ram:SpecifiedTaxRegistration>\n" +
            //             "               <ram:ID schemeID=\"TXID\">010555304504400000</ram:ID>\n" +
            //             "            </ram:SpecifiedTaxRegistration>\n" +
            //             "            <ram:DefinedTradeContact>\n" +
            //             "               <ram:TelephoneUniversalCommunication />\n" +
            //             "            </ram:DefinedTradeContact>\n" +
            //             "            <ram:PostalTradeAddress>\n" +
            //             "               <ram:PostcodeCode>10310</ram:PostcodeCode>\n" +
            //             "               <ram:LineOne>18 อาคารทรู ทาวเวอร์รัชดาภิเษก</ram:LineOne>\n" +
            //             "               <ram:LineTwo>-</ram:LineTwo>\n" +
            //             "               <ram:CityName>1017</ram:CityName>\n" +
            //             "               <ram:CitySubDivisionName>101701</ram:CitySubDivisionName>\n" +
            //             "               <ram:CountryID>TH</ram:CountryID>\n" +
            //             "               <ram:CountrySubDivisionID>10</ram:CountrySubDivisionID>\n" +
            //             "               <ram:BuildingNumber>18</ram:BuildingNumber>\n" +
            //             "            </ram:PostalTradeAddress>\n" +
            //             "         </ram:SellerTradeParty>\n" +
            //             "         <ram:BuyerTradeParty>\n" +
            //             "            <ram:Name>Santi</ram:Name>\n" +
            //             "            <ram:SpecifiedTaxRegistration>\n" +
            //             "               <ram:ID schemeID=\"OTHR\">N/A</ram:ID>\n" +
            //             "            </ram:SpecifiedTaxRegistration>\n" +
            //             "            <ram:DefinedTradeContact>\n" +
            //             "               <ram:PersonName>Santi</ram:PersonName>\n" +
            //             "               <ram:TelephoneUniversalCommunication />\n" +
            //             "            </ram:DefinedTradeContact>\n" +
            //             "            <ram:PostalTradeAddress>\n" +
            //             "               <ram:PostcodeCode>10150</ram:PostcodeCode>\n" +
            //             "               <ram:LineOne>123/45 PPApartment ห้องที่ 1001 ชั้น 1 ถนน Silom ซอย Silom ซอยย่อย 4 ตำบล/แขวง Bangrak อำเภอ/เขต Bangrak จังหวัด Bangkok</ram:LineOne>\n" +
            //             "               <ram:CountryID>TH</ram:CountryID>\n" +
            //             "               <ram:BuildingNumber>123/45</ram:BuildingNumber>\n" +
            //             "            </ram:PostalTradeAddress>\n" +
            //             "         </ram:BuyerTradeParty>\n" +
            //             "      </ram:ApplicableHeaderTradeAgreement>\n" +
            //             "      <ram:ApplicableHeaderTradeDelivery>\n" +
            //             "         <ram:ShipToTradeParty>\n" +
            //             "            <ram:PostalTradeAddress>\n" +
            //             "               <ram:PostcodeCode>10150</ram:PostcodeCode>\n" +
            //             "               <ram:LineOne>123/45 PPApartment ห้องที่ 1001 ชั้น 1 ถนน Silom ซอย Silom ซอยย่อย 4 ตำบล/แขวง Bangrak อำเภอ/เขต Bangrak จังหวัด Bangkok</ram:LineOne>\n" +
            //             "               <ram:CountryID>TH</ram:CountryID>\n" +
            //             "               <ram:BuildingNumber>123/45</ram:BuildingNumber>\n" +
            //             "            </ram:PostalTradeAddress>\n" +
            //             "         </ram:ShipToTradeParty>\n" +
            //             "         <ram:ShipFromTradeParty>\n" +
            //             "            <ram:PostalTradeAddress>\n" +
            //             "               <ram:PostcodeCode>10310</ram:PostcodeCode>\n" +
            //             "               <ram:LineOne>18 อาคารทรู ทาวเวอร์รัชดาภิเษก</ram:LineOne>\n" +
            //             "               <ram:LineTwo>-</ram:LineTwo>\n" +
            //             "               <ram:CityName>1017</ram:CityName>\n" +
            //             "               <ram:CitySubDivisionName>101701</ram:CitySubDivisionName>\n" +
            //             "               <ram:CountryID>TH</ram:CountryID>\n" +
            //             "               <ram:CountrySubDivisionID>10</ram:CountrySubDivisionID>\n" +
            //             "               <ram:BuildingNumber>18</ram:BuildingNumber>\n" +
            //             "            </ram:PostalTradeAddress>\n" +
            //             "         </ram:ShipFromTradeParty>\n" +
            //             "      </ram:ApplicableHeaderTradeDelivery>\n" +
            //             "      <ram:ApplicableHeaderTradeSettlement>\n" +
            //             "         <ram:InvoiceCurrencyCode>THB</ram:InvoiceCurrencyCode>\n" +
            //             "         <ram:ApplicableTradeTax>\n" +
            //             "            <ram:TypeCode>VAT</ram:TypeCode>\n" +
            //             "            <ram:CalculatedRate>7.00</ram:CalculatedRate>\n" +
            //             "            <ram:BasisAmount>93.18</ram:BasisAmount>\n" +
            //             "            <ram:CalculatedAmount>6.52</ram:CalculatedAmount>\n" +
            //             "         </ram:ApplicableTradeTax>\n" +
            //             "         <ram:SpecifiedTradeAllowanceCharge>\n" +
            //             "            <ram:ChargeIndicator>false</ram:ChargeIndicator>\n" +
            //             "            <ram:ActualAmount>93.18</ram:ActualAmount>\n" +
            //             "         </ram:SpecifiedTradeAllowanceCharge>\n" +
            //             "         <ram:SpecifiedTradeSettlementHeaderMonetarySummation>\n" +
            //             "            <ram:LineTotalAmount>93.18</ram:LineTotalAmount>\n" +
            //             "            <ram:TaxBasisTotalAmount>0.00</ram:TaxBasisTotalAmount>\n" +
            //             "            <ram:TaxTotalAmount>6.52</ram:TaxTotalAmount>\n" +
            //             "            <ram:GrandTotalAmount>99.70</ram:GrandTotalAmount>\n" +
            //             "         </ram:SpecifiedTradeSettlementHeaderMonetarySummation>\n" +
            //             "      </ram:ApplicableHeaderTradeSettlement>\n" +
            //             "      <ram:IncludedSupplyChainTradeLineItem>\n" +
            //             "         <ram:AssociatedDocumentLineDocument>\n" +
            //             "            <ram:LineID>1</ram:LineID>\n" +
            //             "         </ram:AssociatedDocumentLineDocument>\n" +
            //             "         <ram:SpecifiedTradeProduct>\n" +
            //             "            <ram:Name>ยอดชำระล่วงหน้า</ram:Name>\n" +
            //             "         </ram:SpecifiedTradeProduct>\n" +
            //             "         <ram:SpecifiedLineTradeAgreement>\n" +
            //             "            <ram:GrossPriceProductTradePrice>\n" +
            //             "               <ram:ChargeAmount>93.18</ram:ChargeAmount>\n" +
            //             "            </ram:GrossPriceProductTradePrice>\n" +
            //             "         </ram:SpecifiedLineTradeAgreement>\n" +
            //             "         <ram:SpecifiedLineTradeDelivery>\n" +
            //             "            <ram:BilledQuantity unitCode=\"JB\">1</ram:BilledQuantity>\n" +
            //             "         </ram:SpecifiedLineTradeDelivery>\n" +
            //             "         <ram:SpecifiedLineTradeSettlement>\n" +
            //             "            <ram:SpecifiedTradeSettlementLineMonetarySummation>\n" +
            //             "               <ram:NetLineTotalAmount currencyID=\"THB\">93.18</ram:NetLineTotalAmount>\n" +
            //             "               <ram:NetIncludingTaxesLineTotalAmount currencyID=\"THB\">93.18</ram:NetIncludingTaxesLineTotalAmount>\n" +
            //             "            </ram:SpecifiedTradeSettlementLineMonetarySummation>\n" +
            //             "         </ram:SpecifiedLineTradeSettlement>\n" +
            //             "      </ram:IncludedSupplyChainTradeLineItem>\n" +
            //             "   </rsm:SupplyChainTradeTransaction>\n" +
            //             "   <ds:Signature xmlns:ds=\"http://www.w3.org/2000/09/xmldsig#\" Id=\"xmldsig-56bee295-2a2a-40db-b4f7-61f4b32e0a72\">\n" +
            //             "      <ds:SignedInfo>\n" +
            //             "         <ds:CanonicalizationMethod Algorithm=\"http://www.w3.org/TR/2001/REC-xml-c14n-20010315\" />\n" +
            //             "         <ds:SignatureMethod Algorithm=\"http://www.w3.org/2001/04/xmldsig-more#rsa-sha512\" />\n" +
            //             "         <ds:Reference Id=\"xmldsig-56bee295-2a2a-40db-b4f7-61f4b32e0a72-ref0\" URI=\"\">\n" +
            //             "            <ds:Transforms>\n" +
            //             "               <ds:Transform Algorithm=\"http://www.w3.org/2000/09/xmldsig#enveloped-signature\" />\n" +
            //             "            </ds:Transforms>\n" +
            //             "            <ds:DigestMethod Algorithm=\"http://www.w3.org/2001/04/xmlenc#sha512\" />\n" +
            //             "            <ds:DigestValue>hhsfGKtZYT6p+Arzq4T27d02QX3jIrpaNtb6y2S/6sUxMykyPWppAavVI1FMGOwLXq+uTCkZ0z8A\n" +
            //             "9S3qsG8mIQ==</ds:DigestValue>\n" +
            //             "         </ds:Reference>\n" +
            //             "         <ds:Reference Type=\"http://uri.etsi.org/01903#SignedProperties\" URI=\"#xmldsig-56bee295-2a2a-40db-b4f7-61f4b32e0a72-signedprops\">\n" +
            //             "            <ds:DigestMethod Algorithm=\"http://www.w3.org/2001/04/xmlenc#sha512\" />\n" +
            //             "            <ds:DigestValue>THuhkEc/38NYX80dxhZMA1GA1vJBgTl4DjSSDoCLdVD4tp9JLBSZ9R0eaMf75Db4LiWlIK0uwvmJ\n" +
            //             "cyuNQ6OkcQ==</ds:DigestValue>\n" +
            //             "         </ds:Reference>\n" +
            //             "      </ds:SignedInfo>\n" +
            //             "      <ds:SignatureValue Id=\"xmldsig-56bee295-2a2a-40db-b4f7-61f4b32e0a72-sigvalue\">YeicmOphrSX8HmvZKpxNafnM0ZdmWbaN/xDtQOlBrGhRJsi0rOoTLb16Y2BuGkRfww7unEyDvnHA\n" +
            //             "xiSgli70KHmGvrlqgmxVUSBVQauIIgU0QqSGov1c9C0y28oWuDkffMUA/B45m3SK/zA64aPVJJg9\n" +
            //             "GtWnQcTBWHOdY+KumARMwW8Cxi1ENYnVjoyF0oS26RemkTzaze84KvqNluj3NBOGME5V2taM4UMO\n" +
            //             "NQB2fiSYdMBgxaRNnEpUGzinjGL1aG6ASK1U6d8kPA9koMMaCCEqPGZiv0+Irem5j5Fd556s1qiz\n" +
            //             "va+hQkjxo8t5klb14lVBQV6RfRVo3J1UjCX9zA==</ds:SignatureValue>\n" +
            //             "      <ds:KeyInfo>\n" +
            //             "         <ds:X509Data>\n" +
            //             "            <ds:X509Certificate>MIIFrjCCA5agAwIBAgIIew6XEhSld4EwDQYJKoZIhvcNAQELBQAwgbUxCzAJBgNVBAYTAnRoMT0w\n" +
            //             "OwYDVQQKDDRNaW5pc3RyeSBvZiBJbmZvcm1hdGlvbiBhbmQgQ29tbXVuaWNhdGlvbiBUZWNobm9s\n" +
            //             "b2d5MUkwRwYDVQQLDEBFbGVjdHJvbmljIFRyYW5zYWN0aW9ucyBEZXZlbG9wbWVudCBBZ2VuY3kg\n" +
            //             "KFB1YmxpYyBPcmdhbml6YXRpb24pMRwwGgYDVQQDDBNUZURBIENBIGZvciBUZXN0aW5nMB4XDTE5\n" +
            //             "MDcwNDA1MDY1MFoXDTIyMDcwNDA1MDY1MFowZTELMAkGA1UEBhMCVEgxMzAxBgNVBAoMKkVsZWN0\n" +
            //             "cm9uaWMgVHJhbnNhY3Rpb25zIERldmVsb3BtZW50IEFnZW5jeTEhMB8GA1UEAwwYQ29kZSBTaWdu\n" +
            //             "aW5nIENlcnRpZmljYXRlMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAoVWH2z88nV0+\n" +
            //             "GuxpyHKZjNWxTv7syQqwL+FiF2KErwdI9rRSKFz5GyOhB5N6Nzjh0AflcfUGrOa+AbjNi+5MGUC3\n" +
            //             "uL2ugo7jMXx2Rwp90aHhGU8jhE/Dx6pdUiQSd6ZLyCTYzIrb4okgDRzsJTe3pFfnM0ScspiU2GMR\n" +
            //             "CMmQgPYWob6BFPgzqIcYK99f82CENg3PFlm4bUWTgvVgF0TTevjLvH8Dx8LvnORW05Hk+jHWbPQu\n" +
            //             "HtarmubUowFv9N1EboBEbFAPxhOp67vctzuoDfOtLaC0unfkXBxzSpnpKg7ZDSEbT4C6hDMqXaAG\n" +
            //             "ZxRWtE6ggVQfjzICOs8ZhV+zkwIDAQABo4IBDzCCAQswVQYIKwYBBQUHAQEESTBHMEUGCCsGAQUF\n" +
            //             "BzAChjlodHRwOi8vcmVwby10ZXN0LnRlZGEudGgvY2VydC9UZURBQ0Fmb3JUZXN0aW5nLmNhY2Vy\n" +
            //             "dC5jcnQwHQYDVR0OBBYEFBnP8q2USQRJ1oTlTds9irSSivl7MAwGA1UdEwEB/wQCMAAwHwYDVR0j\n" +
            //             "BBgwFoAUw7M9c+QxW38JHlzBhP71WNfouZQwQgYDVR0fBDswOTA3oDWgM4YxaHR0cDovL3JlcG8t\n" +
            //             "dGVzdC50ZWRhLnRoL2NybC9UZURBQ0Fmb3JUZXN0aW5nLmNybDALBgNVHQ8EBAMCBPAwEwYDVR0l\n" +
            //             "BAwwCgYIKwYBBQUHAwMwDQYJKoZIhvcNAQELBQADggIBACrFj0Ee4paSEBzmskqyLatVvbnDfUUf\n" +
            //             "DMMkQrSGcD2l2lNaorAtcBZeVJTRMt+doJTNPwpAFbW3rbbAAX+PKAn5M8F2dcj0W/Q6dIw1pQyu\n" +
            //             "RJIBgJ7BwXq7fwbEV3C1AUV3EXTGND4hz7LYRqCIuLi6ODdT3/HBQlEBQtNhKLBBciE81mWKvaQ1\n" +
            //             "g/hAbPZOSDW7WBEw8Kjj1vbPS0lviar8TurRwbwDlYMk6NzpSGPJYUrxjYw54ZJx/1QngKGK6wsZ\n" +
            //             "iV0sj5JbbfxjTwWOhEl2LdulQJ8KNZv+ajQMZqtEeAreAHLyGSG6xgOpPV9aHP9LDTR/d5qi3JB5\n" +
            //             "fwMOvEsWWvzoKzvilR6WO3hYL8qQi/Y4C7oYMkjxVBAALXi2PH4cZSA26SkR2gHQ8FMO1o+StqkB\n" +
            //             "Bjkrtdyhvr+PxijFSh25T3rLlAPBDCALSUPRdLg848k07CleGBzDDETNsFnUhiZXCzD6TWEKqdMV\n" +
            //             "ItzXCuCe+bCX8/wvsVC48chMdxjVHLR3P8csyK+tPS+Te9ipsI3ZgIoDWilNJhKMyaQbmI+zHFzB\n" +
            //             "VVE9cVMkFsGOWh0lKscQA3k1CnhvfIsppyz/ZK6sj7/7Q5+is/4ay5vGhgSPXVhN0kCW5u+esGou\n" +
            //             "VPJLMfqvwhh4V1a+9sQtsRDugqPhzk00/DrI0byUjl65</ds:X509Certificate>\n" +
            //             "         </ds:X509Data>\n" +
            //             "      </ds:KeyInfo>\n" +
            //             "      <ds:Object>\n" +
            //             "         <xades:QualifyingProperties xmlns:xades=\"http://uri.etsi.org/01903/v1.3.2#\" xmlns:xades141=\"http://uri.etsi.org/01903/v1.4.1#\" Target=\"#xmldsig-56bee295-2a2a-40db-b4f7-61f4b32e0a72\">\n" +
            //             "            <xades:SignedProperties Id=\"xmldsig-56bee295-2a2a-40db-b4f7-61f4b32e0a72-signedprops\">\n" +
            //             "               <xades:SignedSignatureProperties>\n" +
            //             "                  <xades:SigningTime>2021-07-13T13:53:41.380+07:00</xades:SigningTime>\n" +
            //             "                  <xades:SigningCertificate>\n" +
            //             "                     <xades:Cert>\n" +
            //             "                        <xades:CertDigest>\n" +
            //             "                           <ns3:DigestMethod Algorithm=\"http://www.w3.org/2001/04/xmlenc#sha512\" />\n" +
            //             "                           <ns3:DigestValue>1r8x/T+ReH+ehYxWyrRkILA2U0whmsLYLrewFjuhiTGSLQX7RchTPF0eZJvhPihlaIGa7xBMzS58\n" +
            //             "iILPkh71MA==</ns3:DigestValue>\n" +
            //             "                        </xades:CertDigest>\n" +
            //             "                        <xades:IssuerSerial>\n" +
            //             "                           <ns3:X509IssuerName>CN=TeDA CA for Testing,OU=Electronic Transactions Development Agency (Public Organization),O=Ministry of Information and Communication Technology,C=th</ns3:X509IssuerName>\n" +
            //             "                           <ns3:X509SerialNumber>8867190820250679169</ns3:X509SerialNumber>\n" +
            //             "                        </xades:IssuerSerial>\n" +
            //             "                     </xades:Cert>\n" +
            //             "                  </xades:SigningCertificate>\n" +
            //             "               </xades:SignedSignatureProperties>\n" +
            //             "            </xades:SignedProperties>\n" +
            //             "         </xades:QualifyingProperties>\n" +
            //             "      </ds:Object>\n" +
            //             "   </ds:Signature>\n" +
            //             "</rsm:TaxInvoice_CrossIndustryInvoice>"
            //     }
            // ]
        };

        console.log(options);

        return new Promise((rs, rj) => {
            try {
                request(options, (error, response, body) => {
                    console.log('error:', error);
                    console.log('statusCode:', response && response.statusCode);
                    console.log('body:', body);


                    if ((response && response.statusCode) == 200) {
                        rs({
                            'body': body,
                            'statusCode': response && response.statusCode,
                        })
                    } else {
                        rj({
                            'message': error.message || error,
                            'statusCode': response && response.statusCode,
                            'body': body
                        })
                    }

                });
            } catch (error) {
                rj(error)
            }

        });
    },
    sendToRDV2: async (req) => {
        let PartyId = '0105553045044'
        let CPAId = 'THRD_ETAXINVOICE_0105553045044_HH_TEST_1.00_b7'
        let ConversationId = 'TT010555304504420064000000099'
        let MessageId = '20001209-133003-8599@example.com'
        let Timestamp = fastify.utils.currentTime()
        // var readStream = fs.readFileSync('xml/ebxml_header.txt', 'utf8')
        console.log()
        const options = {
            method: 'POST',
            url: process.env.RD_URL,
            headers: {
                "Content-Type": "multipart/related; boundary=--BoundarY; start=ebXML-Header; charset=utf-8",
                "SOAPAction" : "\"ebXML\""
            },
            multipart: [
                {
                    "Content-Type": "text/xml; charset=utf-8",
                    "Content-ID" : "ebXML-Header",
                    "body" : `<?xml version="1.0" encoding="UTF-8"?>
                        <SOAP:Envelope
                            xmlns:xlink="http://www.w3.org/1999/xlink"
                            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                            xmlns:SOAP="http://schemas.xmlsoap.org/soap/envelope/"
                            xmlns:eb="http://www.oasis-open.org/committees/ebxml-msg/schema/msg-header-2_0.xsd"
                         xsi:schemaLocation="http://schemas.xmlsoap.org/soap/envelope/
                         http://www.oasis-open.org/committees/ebxml-msg/schema/envelope.xsd
                         http://www.oasis-open.org/committees/ebxml-msg/schema/msg-header-2_0.xsd
                         http://www.oasis-open.org/committees/ebxml-msg/schema/msg-header-2_0.xsd">
                            <SOAP:Header>
                                <eb:MessageHeader SOAP:mustUnderstand="1" eb:version="2.0">
                                    <eb:From>
                                        <eb:PartyId eb:type="string">${PartyId}</eb:PartyId>
                                        <eb:Role>HOST_TO_HOST</eb:Role>
                                    </eb:From>
                                    <eb:To>
                                        <eb:PartyId eb:type="string">THRD</eb:PartyId>
                                        <eb:Role>THRD</eb:Role>
                                    </eb:To>
                                    <eb:CPAId eb:type="string">${CPAId}</eb:CPAId>
                                    <eb:ConversationId>${ConversationId}</eb:ConversationId>
                                    <eb:Service eb:type="string">THRD.eTaxInvoice</eb:Service>
                                    <eb:Action>TIV</eb:Action>
                                    <eb:MessageData>
                                        <eb:MessageId>${MessageId}</eb:MessageId>
                                        <eb:Timestamp>${Timestamp}</eb:Timestamp>
                                    </eb:MessageData>
                                </eb:MessageHeader>
                                <eb:SyncReply SOAP:actor="http://schemas.xmlsoap.org/soap/actor/next"
                                    SOAP:mustUnderstand="1" eb:version="2.0"/>
                                <eb:AckRequested SOAP:actor="urn:oasis:names:tc:ebxml-msg:actor:nextMSH"
                                SOAP:mustUnderstand="1" eb:signed="false" eb:version="2.0"/>
                            </SOAP:Header>
                            <SOAP:Body></SOAP:Body>
                        </SOAP:Envelope>`
                },
                {
                    "Content-Type": "text/xml; charset=utf-8",
                    "Content-ID" : "ebXML-Payload",
                    "body" : ""
                },
            ]
        };

        console.log(options);
        var readStream = fs.readFileSync('xml/ebxml_header.txt', 'utf8')
        http://www.soapclient.com/xml/SoapResponder.wsdl
        return new Promise((rs, rj) => {
            try {
                request(options, (error, response, body) => {
                    console.log('error:', error);
                    console.log('statusCode:', response && response.statusCode);
                    console.log('body:', body);


                    if ((response && response.statusCode) == 200) {
                        rs({
                            'body': body,
                            'statusCode': response && response.statusCode,
                        })
                    } else {
                        rj({
                            'message': error.message || error,
                            'statusCode': response && response.statusCode,
                            'body': body
                        })
                    }

                });
            } catch (error) {
                rj(error)
            }

        });
    },
    consumerRd: async () => {
        console.log('startttttt consumerRd')
        const channel = fastify.amqp.channel
        channel.assertQueue(queue, {
            durable: false
        })

        channel.consume(queue, function(msg) {
            console.log(" [x] Received %s", msg.content.toString());
            // let resp = fastify.services.host2host.sendToRDV2(msg)
            // let xmlData = resp.body
            let xmlData = `<?xml version=\\"1.0\\" encoding=\\"UTF-8\\" ?><SOAP-ENV:Envelope xmlns:SOAP-ENV=\\"http://schemas.xmlsoap.org/soap/envelope/\\" xmlns:xsi=\\"http://www.w3.org/2001/XMLSchema-instance\\" xsi:schemaLocation=\\"http://schemas.xmlsoap.org/soap/envelope/ http://www.oasis-open.org/committees/ebxml-msg/schema/envelope.xsd\\"><SOAP-ENV:Header xsi:schemaLocation=\\"http://www.oasis-open.org/committees/ebxml-msg/schema/msg-header-2_0.xsd http://www.oasis-open.org/committees/ebxml-msg/schema/msg-header-2_0.xsd\\"><eb:MessageHeader xmlns:eb=\\"http://www.oasis-open.org/committees/ebxml-msg/schema/msg-header-2_0.xsd\\" SOAP-ENV:mustUnderstand=\\"1\\" eb:version=\\"2.0\\"><eb:From><eb:PartyId eb:type=\\"string\\">THRD</eb:PartyId></eb:From><eb:To><eb:PartyId eb:type=\\"string\\">0105553045044</eb:PartyId></eb:To><eb:CPAId>THRD_ETAXINVOICE_0105553045044_HH_TEST_1.00_b7</eb:CPAId><eb:ConversationId>TT010555304504420064000000602</eb:ConversationId><eb:Service>urn:oasis:names:tc:ebxml-msg:service</eb:Service><eb:Action>Acknowledgment</eb:Action><eb:MessageData><eb:MessageId>20210810-100442-91329@192.168.69.40</eb:MessageId><eb:Timestamp>2021-08-10T10:04:42.913+07:00</eb:Timestamp><eb:RefToMessageId>20001209-133003-8602@example.com</eb:RefToMessageId></eb:MessageData></eb:MessageHeader><eb:Acknowledgment xmlns:eb=\\"http://www.oasis-open.org/committees/ebxml-msg/schema/msg-header-2_0.xsd\\" SOAP-ENV:actor=\\"urn:oasis:names:tc:ebxml-msg:actor:toPartyMSH\\" SOAP-ENV:mustUnderstand=\\"1\\" eb:version=\\"2.0\\"><eb:Timestamp>2021-08-10T10:04:42.913+07:00</eb:Timestamp><eb:RefToMessageId>20001209-133003-8602@example.com</eb:RefToMessageId><eb:From><eb:PartyId eb:type=\\"string\\">THRD</eb:PartyId></eb:From></eb:Acknowledgment></SOAP-ENV:Header><SOAP-ENV:Body xsi:schemaLocation=\\"http://www.oasis-open.org/committees/ebxml-msg/schema/msg-header-2_0.xsd http://www.oasis-open.org/committees/ebxml-msg/schema/msg-header-2_0.xsd\\"/></SOAP-ENV:Envelope>`
            let resp_json = fastify.utils.xmlToJson(xmlData)
            console.log('resp from rd =>>>>>')
            console.log(util.inspect(resp_json, false, null, true));

            let res_conversationId = resp_json['SOAP-ENV:Envelope']['SOAP-ENV:Header']['eb:MessageHeader']['eb:ConversationId']
            let requestBody = {
                OrderNo: 'PKXXXREFUND8120210720001',
                update: {
                    "Status": "5_1",
                    "State": STATE,
                    "ErrorMessage": '',
                    "Retry": '0',
                    "conversationId": res_conversationId,
                    "LastUpdate": fastify.utils.currentTime()
                }
            }
            console.log(requestBody)
            // fastify.axios.MONGO_SERVICE_V3.post('/etax-document-state', requestBody)
            // this.sendToRD()
        }, {
            noAck: true
        });

    },
    assertQueueRd: async (msg) => {
        const channel = fastify.amqp.channel

        channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)))

        return msg
    },
});
