package com.hardik.pottify.service;

import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class TermPeriod {

	public String getTerm(int term) {
		if (term == 0) {
			return "Past Month";
		} else if (term == 1) {
			return "Past 6 Months";
		} else {
			return "All Time";
		}
	}
}
