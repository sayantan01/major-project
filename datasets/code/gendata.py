from bs4 import BeautifulSoup
import requests
import re
import os
import pandas as pd
from tqdm import tqdm
import numpy as np
from dotenv import load_dotenv

load_dotenv()

HEREAPI_KEY = os.getenv('HEREAPI_KEY')
DISTANCEAPI_KEY = [os.getenv('DISTANCEAPI_KEY1'), os.getenv('DISTANCEAPI_KEY2'), os.getenv('DISTANCEAPI_KEY3')]


def getLatLong(address):
    try:
        url = 'https://geocoder.ls.hereapi.com/search/6.2/geocode.json?languages=en-US&maxresults=4&searchtext={}&apiKey={}'.format(address, HEREAPI_KEY)
        res = requests.get(url).json()
        ret = [res['Response']['View'][0]['Result'][0]['Location']['DisplayPosition']['Latitude'],
                res['Response']['View'][0]['Result'][0]['Location']['DisplayPosition']['Longitude']]
        return ret
    except:
        return None


def extractWarehouses():

	# Scrape the webpage and get the list of govt. medical colleges in west bengal

	url = 'https://www.uppercareers.com/government-medical-colleges-in-west-bengal/'
	page = requests.get(url)
	soup = BeautifulSoup(page.content,'html.parser')
	results = soup.find_all('td')
	colleges = []
	clg_name, dist = None, None
	for i in range(len(results)):
	    if(len(colleges) == 23):
	        break
	    try:
	        s = str(results[i]).replace('&amp;', 'and').replace('\xa0', '')
	        if(i%5 == 1):
	            clg_name = re.search('<a .+>(.+)</a>', s).group(1)
	        elif(i%5 == 2):
	            dist = re.search('<td>(.+)</td>', s).group(1)
	            colleges.append([clg_name, dist])
	    except Exception as e:
	        print('Error::', e)

	# Get the latitude, longitude of each medical college

	latlong,addr = None, None
	for c in tqdm(range(len(colleges)), desc = 'extracting locations of warehouses:'):  
	    i = colleges[c]
	    try:
	        addr = i[0]
	        latlong = getLatLong(addr + ', ' + i[1])
	        if latlong is None:
	            latlong = getLatLong(addr + ', ' + i[1] + ', West Bengal, India')
	            if latlong is None:
	                latlong = getLatLong(''.join([j[0] for j in addr if j[0].isupper() == True]) + ', ' + i[1] + ', West Bengal, India')
	        lat, long = latlong
	        i += latlong
	    except Exception as e:
	        print(i, latlong, addr)

	# Dump the data in a csv file

	colleges = np.array(colleges)
	colleges_df = pd.DataFrame({'college': colleges[:, 0], 'district': colleges[:, 1], 
								'latitude': colleges[:, 2], 'longitude': colleges[:, 3]})
	colleges_df.to_csv('../data/warehouses.csv', index = 0)
	print('successfully dumped warehouses data in datasets/data/warehouses.csv...')
	return colleges



def extractZones():

	# Scrape the wikipedia page and get the list of district headquarters of the districts in west bengal

	url = 'https://en.wikipedia.org/wiki/List_of_districts_of_West_Bengal'
	page = requests.get(url)
	soup = BeautifulSoup(page.content,'html.parser')
	results = soup.find_all('table', {'class':"wikitable"})
	df = pd.read_html(str(results[1]))
	df = pd.DataFrame(df[0])
	df = df.drop(23, axis = 0)
	df = df.sort_values(by = ['District'])
	dist_hq = df['Headquarters[33]'].to_list()

	# Get the district-wise covid data from covid19india.org

	url = 'https://data.covid19india.org/v4/min/data.min.json'
	response = requests.get(url)
	res = response.json()
	dists = res['WB']['districts']
	zones = []
	index = 0
	for d in tqdm(dists.keys(), desc = 'Extracting zones data:'):
	    if(d == 'Other State'):
	        continue
	    dist_name = d
	    hq = dist_hq[index]
	    lat, long = getLatLong(hq)
	    population = dists[d]['meta']['population']
	    infected, dead, recovered, vaccinated = dists[d]['total']['confirmed'], dists[d]['total']['deceased'],\
	                                            dists[d]['total']['recovered'],\
	                                            dists[d]['total']['vaccinated1'] + dists[d]['total']['vaccinated2']
	    zones.append([dist_name, hq, lat, long, population, infected, dead, recovered, vaccinated])
	    index += 1

	# Dump the data in a csv file

	zones = np.array(zones)
	zones_df = pd.DataFrame({'district': zones[:, 0], 'headquarter': zones[:, 1], 
								'latitude': zones[:, 2], 'longitude': zones[:, 3], 
								'population': zones[:, 4], 'infected': zones[:, 5], 'dead': zones[:, 6], 
								'recovered': zones[:, 7], 'vaccinated': zones[:, 8]})
	zones_df.to_csv('../data/zones.csv', index = 0)
	print('successfully dumped zones data in datasets/data/zones.csv...')
	return zones



def generateDistanceMatrix(warehouses, zones):
	from_points = warehouses[:, 2:4]
	to_points = zones[:, 2:4]
	source = [[i[1], i[0]] for i in from_points]
	dest = [[i[1], i[0]] for i in to_points]
	dist_matrix = []
	for source_ind in tqdm(range(len(source))):
		locations = '{},{}'.format(source[source_ind][0], source[source_ind][1])
		for d in dest:
			locations += ';{},{}'.format(d[0], d[1])
		url='https://apis.mapmyindia.com/advancedmaps/v1/{}/distance_matrix/driving/{}?rtype=0&region=ind'.format(DISTANCEAPI_KEY[source_ind//8], locations)
		res = requests.get(url)
		dm = res.json()
		dist_matrix.append(dm['results']['distances'][0])
	np.savetxt('../data/distance_matrix.csv', dist_matrix, delimiter = ',')
	print('successfully dumped distance matrix in datasets/data/distance_matrix.csv...')
	return dist_matrix



if __name__ == '__main__':
	warehouses = extractWarehouses()
	zones = extractZones()
	df = pd.read_csv('../data/warehouses.csv')
	warehouses = df.values.tolist()
	df = pd.read_csv('../data/zones.csv')
	zones = df.values.tolist()
	dist_matrix = generateDistanceMatrix(np.array(warehouses), np.array(zones))
	print('The distance matrix: ')
	print(dist_matrix)
	