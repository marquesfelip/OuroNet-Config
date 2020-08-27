from pathlib import Path
import json
import xml.etree.ElementTree as ET

class setConnections:

    def __init__(self):
        self.setConnectionStringsFile()
        self.setConfigurationServerFile()


    def setConnectionStringsFile(self):
        connectionStringsConfig = ET.parse('C:\\inetpub\\wwwroot\\OuroNetCadastro\\connectionStrings.config')

        rootConnStr = connectionStringsConfig.getroot()

        connStr = rootConnStr.find('connectionStrings')
        connStr.clear()
        connStr.tail = '\n'
        connStr.text = '\n\n  '

        with open(Path(__file__).parent.parent.__str__() + '\\json\\newConnections.json') as data:
            connDict = json.load(data)

        for key in connDict:
            addTag = ET.SubElement(connStr, 'add')

            addTag.attrib['name'] = 'OuroWeb_Custom_' + connDict[key]['Initial Catalog']

            addTag.attrib['connectionString'] = 'Data Source=' + connDict[key]['Data Source'] + ';Initial Catalog=' + connDict[key]['Initial Catalog'] + ';' + 'User ID=ouro;Password=nc7895al63;Application Name=OuroNet'

            addTag.attrib['providerName'] = 'System.Data.SqlClient'
            addTag.tail = '\n\n  '

        connectionStringsConfig.write('C:\\inetpub\\wwwroot\\OuroNetCadastro\\connectionStrings.config', encoding='utf-8', xml_declaration=True, method='xml')
        connectionStringsConfig.write('C:\\inetpub\\wwwroot\\OuroNetMovimento\\connectionStrings.config', encoding='utf-8', xml_declaration=True, method='xml')
        connectionStringsConfig.write('C:\\inetpub\\wwwroot\\OuroNetFinanceiro\\connectionStrings.config', encoding='utf-8', xml_declaration=True, method='xml')

    def setConfigurationServerFile(self):
        configurationServer = ET.parse('C:\\inetpub\\wwwroot\\OuroNetCadastro\\custom.configuration.server.config')
        rootConfSrv = configurationServer.getroot()

        databases = rootConfSrv.find('products').find('product').find('enterprises').find('enterprise').find('databases')
        databases.clear()
        databases.tail = '\n        '
        databases.text = '\n\n            '

        with open(Path(__file__).parent.parent.__str__() + '\\json\\newConnections.json') as data:
            connDict = json.load(data)

        for key in connDict:
            databaseTag = ET.SubElement(databases, 'database')

            databaseTag.attrib['name'] = connDict[key]['Initial Catalog']
            databaseTag.attrib['key'] = 'OuroWeb_Custom_' + connDict[key]['Initial Catalog']
            databaseTag.tail = '\n\n            '
            databaseTag.text = '\n              '

            auxiliarydatabasesTag = ET.SubElement(databaseTag, 'auxiliarydatabases')
            auxiliarydatabasesTag.tail = '\n            '
            auxiliarydatabasesTag.text = '\n                '

            auxdatabaseTag = ET.SubElement(auxiliarydatabasesTag, 'auxdatabase')
            auxdatabaseTag.attrib['name'] = 'OuroReports'
            auxdatabaseTag.attrib['key'] = 'OuroReports_Custom_' + connDict[key]['Initial Catalog']
            auxdatabaseTag.tail = '\n              '

        configurationServer.write('C:\\inetpub\\wwwroot\\OuroNetCadastro\\custom.configuration.server.config', encoding='utf-8', xml_declaration=True, method='xml')
        configurationServer.write('C:\\inetpub\\wwwroot\\OuroNetMovimento\\custom.configuration.server.config', encoding='utf-8', xml_declaration=True, method='xml')
        configurationServer.write('C:\\inetpub\\wwwroot\\OuroNetFinanceiro\\custom.configuration.server.config', encoding='utf-8', xml_declaration=True, method='xml')


def main():
    setConnections()

main()