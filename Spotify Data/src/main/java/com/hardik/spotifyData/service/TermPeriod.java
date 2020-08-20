package com.hardik.spotifyData.service;

import org.springframework.stereotype.Service;

@Service
public class TermPeriod {
	
	public String getTerm(int term) {
		if (term==0) {
			return "Past Month";
		}else if (term==1) {
			return "Past 6 Months";
		}else {
			return "All Time";
		}
	}
}
