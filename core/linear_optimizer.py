from pulp import *
import numpy as np
import pandas as pd

populationDensity = [480,# alipurduar
					523, # bankura
					771, # birbhum
					833, # coooch behar
					780, # dakshin dinajpur balurghat
					586, # Darjeeling
					1800,# Hoogly
					3306,# Howrah
					612, # Jalpaiguri
					370, # Jhargram
					240, # KAlimpong
					24252, # Kolkata
					1071, # Malda
					1334, # murshidabad
					1173, # Nadia
					2400, #  north 24 parganas
					1800, #paschim bardhaman asansol
					636, # paschim mednipur
					890, # purba bardhaman
					1100, # purba mednipur
					470, # Purulia
					820, # south 24 parganas
					956 # uttar dinajpur district
					]
class LinearOptimizer:
	def __init__(self, z):
		# z is the number of batches of vaccine 
		self.z = z
	
	def getWarehouses(self):
		return pd.read_csv('../datasets/data/warehouses.csv').values.tolist()
	
	def getZones(self):
		zones = pd.read_csv('../datasets/data/zones.csv').values.tolist()
		self.zones = zones 
		return zones
	
	def getDistances(self):
		return pd.read_csv('../datasets/data/distance_matrix.csv', header = None).values.tolist()
	
	def calculate_c(self):
		Sb = [b[4] - b[5] - b[6] - b[7] for b in self.zones]
		Vb = [b[8]/2 for b in self.zones]
		c = [(Sb[i] - Vb[i]) / sum(Sb) for i in range(len(Sb))]
		return c
	
	def calculate_tau(self):
		return 0.9
	
	def calculate_vulnerability_score(self):
		
		epsilon = 0.01
		B = pd.read_csv('../datasets/data/zones.csv')
		Sb = [b[4] - b[5] - b[6] - b[7] for b in self.zones]
		Ib = (B['infected']/ B['infected'].sum()) 
		Sb_max =  max(Sb)
		Ib_max = max(Ib)
		Del_max = max(populationDensity)

		totalPopulation = B['population']

		vScore = []

		for i in range(len(B)):
			score = (totalPopulation[i]/totalPopulation.sum())*((Sb[i] + epsilon)/(Sb_max + epsilon))*((Ib[i] + epsilon)/(Ib_max + epsilon))*((populationDensity[i] + epsilon)/(Del_max + epsilon))
			vScore.append(score)

		return vScore


	def constructProb(self, W, B, d, c, tau, z):

		# x is the matrix containing the actual ratios
		x = [[LpVariable("x{},{}".format(i, j), 0, 1) for j in range(len(B))] for i in range(len(W))]

		prob = LpProblem("optimizer", LpMinimize)

		vScore = self.calculate_vulnerability_score()

		vSum = sum(vScore)

		prob += lpSum([lpSum([x[i][j]*d[i][j] for j in range(len(B))]) for i in range(len(W))]) # objective function
		#prob += lpSum([lpSum([x[i][j] for j in range(len(B))]) for i in range(len(W))]) <= len(W)    # C1
		
		for i in range(len(W)):
			prob += lpSum([x[i][j] for j in range(len(B))]) == 1

		for j in range(len(vScore)):
			s=0

			for i in range(len(W)):
				s += x[i][j]
			
			prob += lpSum(s/len(W)) >= (vScore[j]/vSum)

		return [prob, x]
	
	def solve(self):
		W = self.getWarehouses()	# Warehouses
		B = self.getZones()		# Zones(23)
		d = self.getDistances()		# Distances -> Zones(23) * Warehouses
		c = self.calculate_c()		
		tau = self.calculate_tau()
		prob, x = self.constructProb(W, B, d, c, tau, self.z)
		prob.solve()
		optimal_x = [[value(x[i][j]) for j in range(len(x[0]))] for i in range(len(x))]
		return optimal_x


if __name__ == '__main__':
	opt = LinearOptimizer(500)
	solution_matrix = opt.solve()
	non_zero = 0
	for i in solution_matrix:
		print(i)
		for j in i:
			if(j != 0):
				non_zero += 1
	print()
	print('Number of non zero element: ', non_zero)
	np.save('prediction_matrix.npy', solution_matrix)
